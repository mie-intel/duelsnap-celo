"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseEther } from "viem";
import { useWallet } from "../../../hooks/useWallet";
import { usePlayerLog } from "../../../hooks/usePlayerLog";
import { publicClient } from "../../../lib/viem/client";
import {
  questionPoolContract,
  casualPoolContract,
  casualPoolAbi,
} from "../../../lib/viem/contracts";
import { celo } from "../../../lib/viem/chain";
import { ensureBaseSepoliaChain } from "../../../lib/viem/ensureChain";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import GameEngine, {
  type Question,
  type QuestionResult,
} from "../../../components/game/GameEngine";
import { parseContractError } from "../../../lib/parseContractError";

const SECONDS_FREE = 30;
const FREE_DAILY_LIMIT = 3;
const PAID_FEE = parseEther("0.01");

type Phase = "lobby" | "playing" | "done";

async function readJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    if (/<!DOCTYPE|<html/i.test(text)) {
      throw new Error(
        "API returned HTML instead of JSON. Check the server logs for the failing /api route.",
      );
    }
    throw new Error(text.slice(0, 160) || "Invalid API response");
  }
}

export default function CasualPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPaid = searchParams.get("mode") === "paid";
  const { isReady, isConnected, address, walletClient, login } = useWallet();
  const { addEntry } = usePlayerLog(address);

  const [phase, setPhase] = useState<Phase>("lobby");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyCount, setDailyCount] = useState<number | null>(null);
  const [celoBalance, setCeloBalance] = useState<bigint | null>(null);

  const checkDailyLimit = useCallback(async () => {
    if (!address) return;
    try {
      const count = await publicClient.readContract({
        ...questionPoolContract,
        functionName: "getDailyCount",
        args: [address],
      });
      setDailyCount(Number(count));
    } catch {
      setDailyCount(0);
    }
  }, [address]);

  const startFreeGame = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError("");
    try {
      await checkDailyLimit();
      const count = await publicClient.readContract({
        ...questionPoolContract,
        functionName: "getDailyCount",
        args: [address],
      });
      if (Number(count) >= FREE_DAILY_LIMIT) {
        setError(
          `Daily limit reached (${FREE_DAILY_LIMIT}/day). Come back tomorrow!`,
        );
        setLoading(false);
        return;
      }
      const seed = Math.floor(Math.random() * 1e12);
      const res = await fetch(`/api/game/questions?count=5&seed=${seed}`);
      const data = await readJsonResponse<{
        questions?: Question[];
        error?: string;
      }>(res);
      if (!res.ok || !data.questions?.length)
        throw new Error(data.error ?? "No questions");
      setQuestions(data.questions);
      setPhase("playing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start game");
    } finally {
      setLoading(false);
    }
  }, [address, checkDailyLimit]);

  const startPaidGame = useCallback(async () => {
    if (!address || !walletClient) return;
    setLoading(true);
    setError("");
    try {
      await ensureBaseSepoliaChain(walletClient);

      const seed = Math.floor(Math.random() * 1e12);
      const res = await fetch(`/api/game/questions?count=10&seed=${seed}`);
      const data = await readJsonResponse<{
        questions?: Question[];
        error?: string;
      }>(res);
      if (!res.ok || !data.questions?.length)
        throw new Error(data.error ?? "No questions");

      const questionIds = data.questions.map((q: Question) => BigInt(q.id));

      const balance = await publicClient.getBalance({ address });
      if (balance < PAID_FEE) {
        throw new Error(
          `Not enough CELO. Need 0.01 CELO but wallet has ${(Number(balance) / 1e18).toFixed(4)} CELO.`,
        );
      }

      const payHash = await walletClient.writeContract({
        address: casualPoolContract.address,
        abi: casualPoolAbi,
        functionName: "payAndPlay",
        args: [questionIds],
        value: PAID_FEE,
        account: address,
        chain: celo,
        gas: 500_000n,
      });
      const payReceipt = await publicClient.waitForTransactionReceipt({
        hash: payHash,
      });
      if (payReceipt.status === "reverted")
        throw new Error("Casual payment transaction reverted on-chain");

      await fetch("/api/game/casual-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIds: data.questions.map((q: Question) => q.id),
        }),
      });

      setQuestions(data.questions);
      setPhase("playing");
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setLoading(false);
    }
  }, [address, walletClient]);

  const fetchCeloBalance = useCallback(async () => {
    if (!address) return;
    try {
      const bal = await publicClient.getBalance({ address });
      setCeloBalance(bal);
    } catch {
      setCeloBalance(null);
    }
  }, [address]);

  useEffect(() => {
    if (address && !isPaid) checkDailyLimit();
    if (address && isPaid) fetchCeloBalance();
  }, [address, isPaid, checkDailyLimit, fetchCeloBalance]);

  const handleComplete = useCallback(
    async (results: QuestionResult[]) => {
      const correct = results.filter((r) => r.correct).length;
      const threshold = isPaid ? 5 : 3;
      addEntry({
        mode: isPaid ? "casual" : "free",
        result: correct >= threshold ? "win" : "lose",
        amount: 0,
      });

      if (!isPaid && address) {
        try {
          await fetch("/api/game/free-complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
          });
        } catch {
          // non-critical
        }
      }
    },
    [address, addEntry, isPaid],
  );

  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (phase === "playing" && questions.length > 0) {
    return (
      <GameEngine
        questions={questions}
        secondsPerQuestion={SECONDS_FREE}
        mode={isPaid ? "paid" : "free"}
        onComplete={handleComplete}
        onHome={() => router.push("/")}
        onPlayAgain={() => {
          setPhase("lobby");
          setQuestions([]);
          if (!isPaid) checkDailyLimit();
          if (isPaid) fetchCeloBalance();
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5 pb-24">
      <div className="text-center max-w-xs">
        {isPaid ? (
          <>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
              Paid Casual
            </h1>
            <p className="text-text-secondary font-sans text-sm">
              10 questions · 30 sec each · 0.01 CELO
            </p>
            <p className="text-text-secondary text-xs font-sans mt-1">
              90% of fee goes to question contributors
            </p>
            {celoBalance !== null && (
              <p className="text-text-secondary text-xs font-sans mt-2">
                Balance: {(Number(celoBalance) / 1e18).toFixed(4)} CELO
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
              Free Casual
            </h1>
            <p className="text-text-secondary font-sans text-sm">
              5 questions · 30 sec each · {FREE_DAILY_LIMIT} sessions/day
            </p>
            {dailyCount !== null && (
              <p className="text-text-secondary text-xs font-sans mt-2">
                Today: {dailyCount}/{FREE_DAILY_LIMIT} sessions used
              </p>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 rounded-2xl px-4 py-3 text-error text-sm font-sans text-center max-w-xs">
          {error}
        </div>
      )}

      <Button
        onClick={isConnected ? (isPaid ? startPaidGame : startFreeGame) : login}
        loading={loading}
        size="lg"
        className="w-full max-w-xs"
      >
        {isConnected
          ? isPaid
            ? "Pay 0.01 CELO & Start"
            : "Start Game"
          : "Connect Wallet to Play"}
      </Button>

      <Button variant="ghost" onClick={() => router.push("/")} size="sm">
        Back to Home
      </Button>
    </div>
  );
}
