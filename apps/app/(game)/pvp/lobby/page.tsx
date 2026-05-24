"use client";

import { useSendTransaction } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import {
  encodeFunctionData,
  parseEther,
  parseEventLogs,
} from "viem";
import { SwordsIcon } from "../../../../components/icons";
import Button from "../../../../components/ui/Button";
import Spinner from "../../../../components/ui/Spinner";
import { useWallet } from "../../../../hooks/useWallet";
import { parseContractError } from "../../../../lib/parseContractError";
import { celo } from "../../../../lib/viem/chain";
import { publicClient } from "../../../../lib/viem/client";
import {
  gameSessionAbi,
  gameSessionContract,
  CUSD_ADDRESS,
} from "../../../../lib/viem/contracts";
import { useCUSDBalance } from "../../../../hooks/useCUSDBalance";
import { erc20Abi } from "../../../../lib/viem/erc20Abi";

const GAME_SESSION_ADDRESS = gameSessionContract.address;

const WAGER = parseEther("0.1");
const WAGER_CUSD = 100_000_000_000_000_000n; // 0.1 cUSD in wei (18 dec)
const JOIN_SESSION_GAS_LIMIT = 300_000n;
const CREATE_SESSION_GAS_LIMIT = 600_000n;

function isMalformedRpcResponse(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return /Unexpected non-whitespace character after JSON|Unexpected token.*JSON|JSON\.parse/i.test(
    msg,
  );
}

function withGasBuffer(gas: bigint) {
  return (gas * 12n) / 10n;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function FindingOpponentArt() {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      aria-hidden="true"
      className="animate-pulse"
    >
      <circle
        cx="44"
        cy="44"
        r="38"
        fill="currentColor"
        className="text-primary/10"
      />
      <circle
        cx="30"
        cy="37"
        r="10"
        fill="currentColor"
        className="text-primary/30"
      />
      <circle
        cx="58"
        cy="37"
        r="10"
        fill="currentColor"
        className="text-error/30"
      />
      <path
        d="M22 60c4-7 11-11 22-11s18 4 22 11"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-text-secondary/70"
      />
      <path
        d="M38 42l12 4-12 4 3-4-3-4Z"
        fill="currentColor"
        className="text-text-primary"
      />
    </svg>
  );
}

export default function PvpLobbyPage() {
  const router = useRouter();
  const { sendTransaction } = useSendTransaction();
  const {
    isReady,
    isConnected,
    address,
    walletClient,
    walletClientType,
    connectorType,
    login,
  } = useWallet();
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");
  const [useCUSD, setUseCUSD] = useState(false);
  const cusd = useCUSDBalance(address ?? null, GAME_SESSION_ADDRESS);
  const cancelledRef = useRef(false);
  const isEmbeddedPrivyWallet =
    walletClientType === "privy" || connectorType === "embedded";

  const getGasLimit = useCallback(
    async (to: `0x${string}`, data: `0x${string}`, value: bigint, fallback: bigint) => {
      if (!address) return fallback;
      try {
        const estimatedGas = await publicClient.estimateGas({
          account: address,
          to,
          data,
          value,
        });
        return withGasBuffer(estimatedGas);
      } catch (e) {
        if (isMalformedRpcResponse(e)) return fallback;
        throw e;
      }
    },
    [address],
  );

  const sendEncodedTransaction = useCallback(
    async (params: {
      to: `0x${string}`;
      data: `0x${string}`;
      value: bigint;
      fallbackGasLimit: bigint;
      description: string;
      buttonText: string;
      successHeader: string;
    }) => {
      if (!address) throw new Error("Wallet not connected.");

      if (isEmbeddedPrivyWallet) {
        const gasLimit = await getGasLimit(
          params.to,
          params.data,
          params.value,
          params.fallbackGasLimit,
        );
        const result = await sendTransaction(
          {
            from: address,
            to: params.to,
            data: params.data,
            value: params.value,
            chainId: celo.id,
            gasLimit,
          },
          {
            address,
            uiOptions: {
              showWalletUIs: true,
              description: params.description,
              buttonText: params.buttonText,
              successHeader: params.successHeader,
            },
          },
        );
        return result.hash as `0x${string}`;
      }

      if (!walletClient) throw new Error("Wallet signer is not ready yet.");
      return await walletClient.sendTransaction({
        account: address,
        chain: celo,
        to: params.to,
        data: params.data,
        value: params.value,
      });
    },
    [address, getGasLimit, isEmbeddedPrivyWallet, sendTransaction, walletClient],
  );

  const waitForSuccessfulReceipt = useCallback(
    async (hash: `0x${string}`, action: string) => {
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === "reverted") {
        throw new Error(`${action} reverted on-chain. Check CELO balance and try again.`);
      }
      return receipt;
    },
    [],
  );

  const ensureCeloBalance = useCallback(async () => {
    if (!address) return;
    const balance = await publicClient.getBalance({ address });
    if (balance < WAGER) {
      throw new Error(
        `Not enough CELO. Need 0.1 CELO but wallet has ${(Number(balance) / 1e18).toFixed(4)} CELO.`,
      );
    }
  }, [address]);

  const sendJoinSession = useCallback(
    async (sessionId: `0x${string}`) => {
      const data = encodeFunctionData({
        abi: gameSessionAbi,
        functionName: "joinSession",
        args: [sessionId],
      });
      return await sendEncodedTransaction({
        to: gameSessionContract.address,
        data,
        value: WAGER,
        fallbackGasLimit: JOIN_SESSION_GAS_LIMIT,
        description: "Join PvP match — 0.1 CELO wager",
        buttonText: "Join",
        successHeader: "Joined match",
      });
    },
    [sendEncodedTransaction],
  );

  const sendCreateSession = useCallback(
    async (questionIds: bigint[]) => {
      const data = encodeFunctionData({
        abi: gameSessionAbi,
        functionName: "createSession",
        args: [WAGER, questionIds],
      });
      return await sendEncodedTransaction({
        to: gameSessionContract.address,
        data,
        value: WAGER,
        fallbackGasLimit: CREATE_SESSION_GAS_LIMIT,
        description: "Create PvP match — 0.1 CELO wager",
        buttonText: "Create Match",
        successHeader: "Match created",
      });
    },
    [sendEncodedTransaction],
  );

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    setMatching(false);
    setMatchError("");
    setError("");
    router.push("/");
  }, [router]);

  const handlePlay = useCallback(async () => {
    if (!address) return;
    cancelledRef.current = false;
    setMatching(true);
    setError("");
    setMatchError("");

    try {
      const matchRes = await fetch("/api/pvp/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "find", playerAddress: address }),
      });
      const matchData = await matchRes.json();
      if (!matchRes.ok) throw new Error(matchData.error);

      if (matchData.action === "resume") {
        router.push(`/pvp/${matchData.sessionId}`);
        return;
      }

      if (matchData.action === "join") {
        const sessionId = matchData.sessionId as `0x${string}`;
        await ensureCeloBalance();
        const hash = await sendJoinSession(sessionId);
        await waitForSuccessfulReceipt(hash, "Joining PvP session");

        await fetch("/api/pvp/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "claim", sessionId }),
        });

        router.push(`/pvp/${sessionId}`);
        return;
      }

      const questionIds = (matchData.questionIds ?? []).map(
        (id: number | string) => BigInt(id),
      );
      if (questionIds.length === 0) {
        throw new Error("No questions available for PvP.");
      }

      await ensureCeloBalance();

      const hash = await sendCreateSession(questionIds);
      const receipt = await waitForSuccessfulReceipt(hash, "Session creation");
      let sessionId: `0x${string}` | null = null;
      try {
        const createdLogs = parseEventLogs({
          abi: gameSessionAbi,
          eventName: "SessionCreated",
          logs: receipt.logs,
          strict: false,
        });
        const args = createdLogs[0]?.args as
          | { id?: `0x${string}`; sessionId?: `0x${string}` }
          | undefined;
        sessionId = args?.sessionId ?? args?.id ?? null;
      } catch {
        // handled by null check below
      }

      if (!sessionId) {
        throw new Error(
          "Session was created, but the session ID was missing from the receipt. Try the lobby again.",
        );
      }

      await fetch("/api/pvp/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          playerAddress: address,
          sessionId,
          questionIds: questionIds.map(Number),
        }),
      });

      router.push(`/pvp/${sessionId}`);
    } catch (e) {
      if (cancelledRef.current) return;
      const msg = parseContractError(e);
      const isFatal =
        /rejected|Not enough|Wrong network|reverted|malformed|Wallet signer/i.test(
          msg,
        );
      if (isFatal) {
        setError(msg);
        setMatching(false);
      } else {
        setMatchError(msg);
      }
    }
  }, [
    address,
    ensureCeloBalance,
    router,
    sendCreateSession,
    sendJoinSession,
    waitForSuccessfulReceipt,
  ]);

  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5 pb-24">
        <SwordsIcon className="w-16 h-16 text-error" />
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
            PvP Ranked
          </h1>
          <p className="text-text-secondary font-sans text-sm">
            Connect wallet to battle 1v1
          </p>
        </div>
        <Button onClick={login} size="lg" className="w-full max-w-xs">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5 pb-24">
      {matching ? (
        <FindingOpponentArt />
      ) : (
        <SwordsIcon className="w-16 h-16 text-error" />
      )}

      <div className="text-center">
        <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
          PvP Ranked
        </h1>
        <p className="text-text-secondary font-sans text-sm">
          {useCUSD ? "0.1 cUSD" : "0.1 CELO"} wager · 10 questions · 8 sec each
        </p>
        <p className="text-text-secondary text-xs font-sans mt-1">
          Play now and we&apos;ll find your opponent automatically.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => setUseCUSD(false)}
            className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors ${
              !useCUSD ? "bg-celo-green text-black" : "bg-surface-secondary text-text-secondary"
            }`}
          >
            CELO
          </button>
          <button
            onClick={() => setUseCUSD(true)}
            className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors ${
              useCUSD ? "bg-celo-green text-black" : "bg-surface-secondary text-text-secondary"
            }`}
          >
            cUSD
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 rounded-2xl px-4 py-3 text-error text-sm font-sans text-center max-w-xs">
          {error}
        </div>
      )}

      {matching ? (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <p className="text-text-primary font-semibold font-sans text-center">
            {matchError ? "Having trouble..." : "Finding opponent..."}
          </p>
          {matchError ? (
            <p className="text-error text-xs font-sans text-center">
              {matchError}
            </p>
          ) : (
            <p className="text-text-secondary text-sm font-sans text-center">
              If someone is already waiting, you&apos;ll join them instantly.
              Otherwise, we&apos;ll keep your room open.
            </p>
          )}
          <div className="flex items-center gap-2 text-text-secondary text-xs font-sans">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
          </div>
          <Button variant="ghost" onClick={handleCancel} size="sm">
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            onClick={handlePlay}
            size="lg"
            className="w-full"
            loading={matching}
          >
            Play
          </Button>
          <Button variant="ghost" onClick={() => router.push("/")} size="sm">
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
