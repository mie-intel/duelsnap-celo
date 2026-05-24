"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseEther } from "viem";
import { useWallet } from "../../../hooks/useWallet";
import { usePlayerLog } from "../../../hooks/usePlayerLog";
import { useCUSDBalance } from "../../../hooks/useCUSDBalance";
import { publicClient } from "../../../lib/viem/client";
import {
  questionPoolContract,
  casualPoolContract,
  casualPoolAbi,
  CUSD_ADDRESS,
} from "../../../lib/viem/contracts";
import { erc20Abi } from "../../../lib/viem/erc20Abi";
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
const CASUAL_POOL_ADDRESS = casualPoolContract.address;

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
  const [useCUSD, setUseCUSD] = useState(false);
  const [feeAmountCUSD, setFeeAmountCUSD] = useState<bigint>(0n);

  const cusd = useCUSDBalance(address ?? null);

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

  const fetchFeeAmountCUSD = useCallback(async () => {
    try {
      const fee = await publicClient.readContract({
        ...casualPoolContract,
        functionName: "feeAmountCUSD",
        args: [],
      });
      setFeeAmountCUSD(fee as bigint);
    } catch {
      // keep 0n
    }
  }, []);

  const approveCUSD = useCallback(async () => {
    if (!address || !walletClient) return;
    setLoading(true);
    setError("");
    try {
      await ensureBaseSepoliaChain(walletClient);
      const hash = await walletClient.writeContract({
        address: CUSD_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [CASUAL_POOL_ADDRESS, feeAmountCUSD],
        account: address,
        chain: celo,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      await cusd.refresh();
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setLoading(false);
    }
  }, [address, walletClient, feeAmountCUSD, cusd]);

  const startPaidGameCUSD = useCallback(async () => {
    if (!address || !walletClient) return;
    setLoading(true);
    setError("");
    try {
      await ensureBaseSepoliaChain(walletClient);

      if (cusd.balance < feeAmountCUSD) {
        throw new Error(
          `Not enough cUSD. Need ${Number(feeAmountCUSD) / 1e18} cUSD but wallet has ${cusd.balanceFormatted} cUSD.`,
        );
      }

      const seed = Math.floor(Math.random() * 1e12);
      const res = await fetch(`/api/game/questions?count=10&seed=${seed}`);
      const data = await readJsonResponse<{
        questions?: Question[];
        error?: string;
      }>(res);
      if (!res.ok || !data.questions?.length)
        throw new Error(data.error ?? "No questions");

      const questionIds = data.questions.map((q: Question) => BigInt(q.id));

      const payHash = await walletClient.writeContract({
        address: casualPoolContract.address,
        abi: casualPoolAbi,
        functionName: "payAndPlayWithCUSD",
        args: [questionIds],
        account: address,
        chain: celo,
        gas: 500_000n,
      });
      const payReceipt = await publicClient.waitForTransactionReceipt({
        hash: payHash,
      });
      if (payReceipt.status === "reverted")
        throw new Error("cUSD payment transaction reverted on-chain");

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
  }, [address, walletClient, feeAmountCUSD, cusd]);

  useEffect(() => {
    if (address && !isPaid) checkDailyLimit();
    if (address && isPaid) {
      fetchCeloBalance();
      fetchFeeAmountCUSD();
    }
  }, [address, isPaid, checkDailyLimit, fetchCeloBalance, fetchFeeAmountCUSD]);

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
      <div className="text-center max-w-xs lg:max-w-md">
        {isPaid ? (
          <>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
              Paid Casual
            </h1>
            <p className="text-text-secondary font-sans text-sm">
              10 questions · 30 sec each
            </p>
            <p className="text-text-secondary text-xs font-sans mt-1">
              90% of fee goes to question contributors
            </p>

            {/* Payment toggle */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setUseCUSD(false)}
                className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors ${
                  !useCUSD
                    ? "bg-celo-green text-black"
                    : "bg-surface-secondary text-text-secondary"
                }`}
              >
                0.01 CELO
              </button>
              <button
                onClick={() => setUseCUSD(true)}
                className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors ${
                  useCUSD
                    ? "bg-celo-green text-black"
                    : "bg-surface-secondary text-text-secondary"
                }`}
              >
                cUSD
              </button>
            </div>

            {/* Balance display */}
            <p className="text-text-secondary text-xs font-sans mt-2">
              {useCUSD
                ? `cUSD Balance: ${cusd.balanceFormatted} cUSD`
                : celoBalance !== null
                  ? `Balance: ${(Number(celoBalance) / 1e18).toFixed(4)} CELO`
                  : null}
            </p>
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

      {/* cUSD: show Approve button if allowance insufficient */}
      {isConnected && isPaid && useCUSD && cusd.allowance < feeAmountCUSD && feeAmountCUSD > 0n && (
        <Button
          onClick={approveCUSD}
          loading={loading}
          size="lg"
          variant="secondary"
          className="w-full max-w-xs lg:max-w-sm"
        >
          Approve cUSD
        </Button>
      )}

      <Button
        onClick={
          !isConnected
            ? login
            : isPaid
              ? useCUSD
                ? cusd.allowance >= feeAmountCUSD
                  ? startPaidGameCUSD
                  : approveCUSD
                : startPaidGame
              : startFreeGame
        }
        loading={loading}
        size="lg"
        className="w-full max-w-xs lg:max-w-sm"
      >
        {!isConnected
          ? "Connect Wallet to Play"
          : isPaid
            ? useCUSD
              ? cusd.allowance < feeAmountCUSD
                ? "Approve cUSD First"
                : `Pay ${Number(feeAmountCUSD) / 1e18} cUSD & Start`
              : "Pay 0.01 CELO & Start"
            : "Start Game"}
      </Button>

      <Button variant="ghost" onClick={() => router.push("/")} size="sm">
        Back to Home
      </Button>
    </div>
  );
}
