import { NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { redis } from "../../../../../lib/redis/client";
import { parseRedisArray } from "../../../../../lib/redis/json";
import { baseSepolia } from "../../../../../lib/viem/chain";
import {
  gameSessionAbi,
  gameSessionContract,
} from "../../../../../lib/viem/contracts";

const CELO_RPC =
  process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org";

const PVP_WAGER_RAW = 500_000; // Rp 5.000 per player (2 decimals)
const PVP_POOL_RAW = PVP_WAGER_RAW * 2;
const PVP_CONTRIBUTOR_BPS = 1000;
const BPS_DENOMINATOR = 10000;

type SessionTuple = readonly [
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
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

function normalizeAnswer(value: unknown): string {
  if (value == null) return "";
  return String(value).trim().toUpperCase();
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await params;
    const { playerAddress, answers } = await req.json();

    if (!playerAddress || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const session = await fetchSession(sessionId);
    const isPlayer1 =
      session.player1.toLowerCase() === playerAddress.toLowerCase();
    const isPlayer2 =
      session.player2.toLowerCase() === playerAddress.toLowerCase();
    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    const key = isPlayer1 ? `pvp:${sessionId}:p1` : `pvp:${sessionId}:p2`;
    await redis.set(key, JSON.stringify(answers), { ex: 3600 });

    const p1Raw = await redis.get<unknown>(`pvp:${sessionId}:p1`);
    const p2Raw = await redis.get<unknown>(`pvp:${sessionId}:p2`);

    if (!p1Raw || !p2Raw) {
      return NextResponse.json({ status: "waiting_for_opponent" });
    }

    const qRaw = await redis.get<unknown>(`pvp:${sessionId}:q`);
    const questionIds = parseRedisArray<string | number | bigint>(qRaw).map(
      String,
    );
    const p1Answers = parseRedisArray<unknown>(p1Raw);
    const p2Answers = parseRedisArray<unknown>(p2Raw);

    let score1 = 0,
      score2 = 0;
    for (let i = 0; i < questionIds.length; i++) {
      const correctRaw = await redis.get<unknown>(
        `question:${questionIds[i]}:answer`,
      );
      const correctAnswer = normalizeAnswer(correctRaw);
      if (!correctAnswer) continue;
      const p1Guess = normalizeAnswer(p1Answers[i]);
      const p2Guess = normalizeAnswer(p2Answers[i]);
      if (p1Guess && p1Guess === correctAnswer) score1++;
      if (p2Guess && p2Guess === correctAnswer) score2++;
    }

    const winner =
      score1 > score2
        ? session.player1
        : score2 > score1
          ? session.player2
          : "tie";

    try {
      const faucetKey = process.env.FAUCET_PRIVATE_KEY as `0x${string}`;
      const account = privateKeyToAccount(faucetKey);
      const walletRelayer = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http(CELO_RPC),
      });
      const pubClient = createPublicClient({
        chain: baseSepolia,
        transport: http(CELO_RPC),
      });

      const resolveHash = await walletRelayer.writeContract({
        address: gameSessionContract.address,
        abi: gameSessionAbi,
        functionName: "resolveByRelayer",
        args: [
          sessionId as `0x${string}`,
          winner === "tie"
            ? "0x0000000000000000000000000000000000000000"
            : winner,
          score1,
          score2,
        ],
      });
      const receipt = await pubClient.waitForTransactionReceipt({
        hash: resolveHash,
      });
      if (receipt.status === "reverted") {
        return NextResponse.json(
          { error: "PvP settlement reverted on-chain" },
          { status: 500 },
        );
      }
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to resolve PvP session";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    await redis.set(`pvp:${sessionId}:winner`, winner, { ex: 3600 });
    await trackPvpContributorEarnings(questionIds);

    return NextResponse.json({ status: "resolved", winner, score1, score2 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function fetchSession(sessionId: string) {
  const { publicClient } = await import("../../../../../lib/viem/client");
  const { gameSessionContract } = await import(
    "../../../../../lib/viem/contracts"
  );
  const session = (await publicClient.readContract({
    ...gameSessionContract,
    functionName: "sessions",
    args: [sessionId as `0x${string}`],
  })) as SessionTuple;
  return {
    player1: session[1],
    player2: session[2],
    status: session[9],
  };
}

async function trackPvpContributorEarnings(questionIds: string[]) {
  if (questionIds.length === 0) return;
  const totalContributorShare = Math.floor(
    (PVP_POOL_RAW * PVP_CONTRIBUTOR_BPS) / BPS_DENOMINATOR,
  );
  const perQuestion = Math.floor(totalContributorShare / questionIds.length);
  if (perQuestion <= 0) return;

  await Promise.all(
    questionIds.map(async (id) => {
      try {
        const [currentPlays, currentEarned] = await Promise.all([
          redis.get<number>(`question:${id}:pvpPlays`),
          redis.get<number>(`question:${id}:pvpEarnedRaw`),
        ]);
        await Promise.all([
          redis.set(`question:${id}:pvpPlays`, Number(currentPlays ?? 0) + 1),
          redis.set(
            `question:${id}:pvpEarnedRaw`,
            Number(currentEarned ?? 0) + perQuestion,
          ),
        ]);
      } catch {
        // tracking is best-effort; payout already happened on-chain
      }
    }),
  );
}
