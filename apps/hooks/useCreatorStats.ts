"use client";

import { useCallback, useEffect, useState } from "react";
import type { Address } from "viem";
import { parseEventLogs } from "viem";
import { publicClient } from "../lib/viem/client";
import {
  casualPoolAbi,
  casualPoolContract,
  gameSessionAbi,
  gameSessionContract,
  questionPoolContract,
} from "../lib/viem/contracts";

export type CreatorQuestion = {
  id: number;
  isVerified: boolean;
  imageUrl: string | null;
  timesPlayed: number;
  earned: number; // CELO in wei (18 decimals), as Number (safe for < ~0.009 CELO)
};

// 90% of 0.01 CELO / 10 questions = 0.0009 CELO = 9e14 wei per question per game
const EARNED_PER_PLAY = 900_000_000_000_000; // 0.0009 CELO in wei
const PVP_CONTRIBUTOR_BPS = 1000n;
const BPS_DENOMINATOR = 10_000n;

type SessionTuple = readonly [
  `0x${string}`,
  Address,
  Address,
  bigint,
  number,
  `0x${string}`,
  `0x${string}`,
  number,
  number,
  number,
  bigint,
  bigint,
];
const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://gateway.pinata.cloud";
const CREATOR_STATS_REFRESH_MS = 60_000;

export function useCreatorStats(address?: string | null) {
  const [questions, setQuestions] = useState<CreatorQuestion[]>([]);
  const [pendingRoyalty, setPendingRoyalty] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const clearPendingRoyalty = useCallback(() => {
    setPendingRoyalty(0);
  }, []);

  useEffect(() => {
    if (!address) {
      setQuestions([]);
      setPendingRoyalty(0);
      setLoading(false);
      setError("");
      return;
    }

    const refreshToken = reloadKey;
    let cancelled = false;

    async function load(showSpinner = false) {
      void refreshToken;
      if (showSpinner) {
        setLoading(true);
      }
      try {
        const addr = address as Address;

        // Pending royalty balance
        let pending = 0n;
        try {
          pending = (await publicClient.readContract({
            ...casualPoolContract,
            functionName: "pendingRoyalty",
            args: [addr],
          })) as bigint;
        } catch {
          // ignore
        }
        // Store as number - safe for amounts < 9 CELO (9e18 > Number.MAX_SAFE_INTEGER)
        // clamp to avoid overflow for large balances
        setPendingRoyalty(pending > 9_000_000_000_000_000_000n ? 9_000_000_000_000_000_000 : Number(pending));

        const questionCount = (await publicClient.readContract({
          ...questionPoolContract,
          functionName: "questionCount",
        })) as bigint;

        if (questionCount === 0n) {
          setQuestions([]);
          return;
        }

        type QuestionRecord = [
          bigint,
          Address,
          string,
          boolean,
          number,
          bigint,
          bigint,
        ];

        const allIds = Array.from({ length: Number(questionCount) }, (_, i) =>
          BigInt(i + 1),
        );

        const allDetails = (await Promise.all(
          allIds.map((id) =>
            publicClient.readContract({
              ...questionPoolContract,
              functionName: "questions",
              args: [id],
            }),
          ),
        )) as QuestionRecord[];

        const owned = allDetails
          .map((detail, index) => ({ id: allIds[index], detail }))
          .filter(
            ({ detail }) => detail[1].toLowerCase() === addr.toLowerCase(),
          );

        const ids = owned.map(({ id }) => id);
        if (ids.length === 0) {
          setQuestions([]);
          return;
        }

        const details = owned.map(({ detail }) => detail);

        // Per-question play count and earnings from paid modes
        const casualPlayCount: Record<number, number> = {};
        const casualEarnedMap: Record<number, number> = {};
        const pvpPlayCount: Record<number, number> = {};
        const pvpEarnedMap: Record<number, number> = {};
        try {
          const casualLogs = await publicClient.getLogs({
            address: casualPoolContract.address,
            fromBlock: 0n,
          });

          const parsedCasualLogs = parseEventLogs({
            abi: casualPoolAbi,
            eventName: "CasualFeePaid",
            logs: casualLogs,
            strict: false,
          });

          for (const log of parsedCasualLogs) {
            const qIds = (log.args.questionIds ?? []) as bigint[];
            for (const qId of qIds) {
              const n = Number(qId);
              casualPlayCount[n] = (casualPlayCount[n] ?? 0) + 1;
              casualEarnedMap[n] = (casualEarnedMap[n] ?? 0) + EARNED_PER_PLAY;
            }
          }
        } catch {
          // event scan optional — earnings fallback to 0
        }

        try {
          const resolvedLogs = await publicClient.getLogs({
            address: gameSessionContract.address,
            fromBlock: 0n,
          });

          const parsedResolved = parseEventLogs({
            abi: gameSessionAbi,
            eventName: "SessionResolved",
            logs: resolvedLogs,
            strict: false,
          });
          const parsedTied = parseEventLogs({
            abi: gameSessionAbi,
            eventName: "SessionTied",
            logs: resolvedLogs,
            strict: false,
          });

          const settledSessionIds = [
            ...parsedResolved.map((log) => log.args.sessionId),
            ...parsedTied.map((log) => log.args.sessionId),
          ].filter((sessionId): sessionId is `0x${string}` => !!sessionId);

          const uniqueSessionIds = Array.from(new Set(settledSessionIds));

          const sessionData = await Promise.all(
            uniqueSessionIds.map(async (sessionId) => {
              const [session, questionIds] = await Promise.all([
                publicClient.readContract({
                  ...gameSessionContract,
                  functionName: "sessions",
                  args: [sessionId],
                }) as Promise<SessionTuple>,
                publicClient.readContract({
                  ...gameSessionContract,
                  functionName: "getQuestionIds",
                  args: [sessionId],
                }) as Promise<readonly bigint[]>,
              ]);

              return { session, questionIds };
            }),
          );

          for (const { session, questionIds } of sessionData) {
            const wager = session[3];
            const activeQuestionIds = questionIds
              .map(Number)
              .filter((id) => id > 0);
            const count = activeQuestionIds.length;
            if (wager <= 0n || count === 0) continue;

            const contributorShare = Number(
              (wager * 2n * PVP_CONTRIBUTOR_BPS) / BPS_DENOMINATOR,
            );
            const perQuestion = Math.floor(contributorShare / count);

            for (const qId of activeQuestionIds) {
              pvpPlayCount[qId] = (pvpPlayCount[qId] ?? 0) + 1;
              pvpEarnedMap[qId] = (pvpEarnedMap[qId] ?? 0) + perQuestion;
            }
          }
        } catch {
          // pvp event scan optional — earnings fallback to current totals
        }

        // Image URLs from API (accepts comma-separated ids)
        const imageMap: Record<number, string> = {};
        const trackedMetrics: Record<
          number,
          {
            plays: number;
            earned: number;
            pvpPlays: number;
            pvpEarned: number;
          }
        > = {};
        try {
          const res = await fetch(
            `/api/game/questions?ids=${ids.map(Number).join(",")}`,
          );
          if (res.ok) {
            const data = (await res.json()) as {
              questions: { id: number; imageUrl: string }[];
            };
            for (const q of data.questions ?? []) imageMap[q.id] = q.imageUrl;
          }
        } catch {
          // images optional
        }

        try {
          const res = await fetch(
            `/api/game/casual-track?ids=${ids.map(Number).join(",")}`,
          );
          if (res.ok) {
            const data = (await res.json()) as {
              metrics?: {
                id: number;
                plays: number;
                earned: number;
                pvpPlays?: number;
                pvpEarned?: number;
              }[];
            };
            for (const metric of data.metrics ?? []) {
              trackedMetrics[metric.id] = {
                plays: metric.plays,
                earned: metric.earned,
                pvpPlays: metric.pvpPlays ?? 0,
                pvpEarned: metric.pvpEarned ?? 0,
              };
            }
          }
        } catch {
          // tracked metrics optional
        }

        const result: CreatorQuestion[] = ids
          .map((id, i) => {
            const n = Number(id);
            const casualPlays =
              trackedMetrics[n]?.plays ?? casualPlayCount[n] ?? 0;
            const pvpPlays =
              trackedMetrics[n]?.pvpPlays ?? pvpPlayCount[n] ?? 0;
            const totalPlays = casualPlays + pvpPlays;
            const casualEarned =
              trackedMetrics[n]?.earned ?? casualEarnedMap[n] ?? 0;
            const pvpEarned =
              trackedMetrics[n]?.pvpEarned ?? pvpEarnedMap[n] ?? 0;
            const totalEarned = casualEarned + pvpEarned;
            const ipfsHash = details[i][2];
            const fallbackImageUrl = ipfsHash
              ? `${IPFS_GATEWAY}/ipfs/${ipfsHash}`
              : null;
            return {
              id: n,
              isVerified: details[i][3] ?? false,
              imageUrl: imageMap[n] ?? fallbackImageUrl,
              timesPlayed: totalPlays,
              earned: totalEarned,
            };
          })
          .sort((a, b) => b.id - a.id);

        if (!cancelled) {
          setQuestions(result);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load creator stats",
          );
        }
      } finally {
        if (!cancelled && showSpinner) {
          setLoading(false);
        }
      }
    }

    load(true);

    const interval = setInterval(() => {
      void load(false);
    }, CREATOR_STATS_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address, reloadKey]);

  return {
    questions,
    pendingRoyalty,
    loading,
    error,
    refresh,
    clearPendingRoyalty,
  };
}
