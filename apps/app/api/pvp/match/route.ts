import { NextResponse } from "next/server";
import { redis } from "../../../../lib/redis/client";
import { parseRedisJson } from "../../../../lib/redis/json";
import { publicClient } from "../../../../lib/viem/client";
import {
  gameSessionContract,
  questionPoolContract,
} from "../../../../lib/viem/contracts";

const PENDING_KEY = "pvp:pending";
const PENDING_TTL_SECONDS = 60 * 10;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

type PendingSession = {
  sessionId: string;
  playerAddress: string;
  createdAt: number;
};

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

async function getRandomQuestionIds() {
  const seed = BigInt(Math.floor(Math.random() * 1e12));
  const ids = (await publicClient.readContract({
    ...questionPoolContract,
    functionName: "getRandomQuestions",
    args: [10n, seed],
  })) as bigint[];
  return ids.map((id) => Number(id));
}

async function readPendingSession() {
  const raw = await redis.get<unknown>(PENDING_KEY);
  if (!raw) return null;

  try {
    return parseRedisJson<PendingSession>(raw);
  } catch {
    await redis.del(PENDING_KEY);
    return null;
  }
}

async function clearPendingSession(sessionId?: string) {
  const pending = await readPendingSession();
  if (!pending) return;
  if (
    !sessionId ||
    pending.sessionId.toLowerCase() === sessionId.toLowerCase()
  ) {
    await redis.del(PENDING_KEY);
  }
}

async function ensurePendingSessionIsUsable(
  pending: PendingSession | null,
  playerAddress: string,
) {
  if (!pending) return null;

  try {
    const session = (await publicClient.readContract({
      ...gameSessionContract,
      functionName: "sessions",
      args: [pending.sessionId as `0x${string}`],
    })) as SessionTuple;

    const player1 = session[1];
    const status = session[9];
    const playDeadline = session[10];

    const now = BigInt(Math.floor(Date.now() / 1000));
    if (
      player1.toLowerCase() === ZERO_ADDRESS ||
      status !== 0 ||
      playDeadline <= now
    ) {
      await clearPendingSession(pending.sessionId);
      return null;
    }

    if (pending.playerAddress.toLowerCase() === playerAddress.toLowerCase()) {
      return { action: "resume" as const, sessionId: pending.sessionId };
    }

    return { action: "join" as const, sessionId: pending.sessionId };
  } catch {
    await clearPendingSession(pending.sessionId);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      action?: "find" | "register" | "claim";
      playerAddress?: string;
      sessionId?: string;
      questionIds?: number[];
    };

    if (body.action === "register") {
      if (
        !body.playerAddress ||
        !body.sessionId ||
        !Array.isArray(body.questionIds)
      ) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      await redis.set(
        PENDING_KEY,
        JSON.stringify({
          sessionId: body.sessionId,
          playerAddress: body.playerAddress,
          createdAt: Date.now(),
        } satisfies PendingSession),
        { ex: PENDING_TTL_SECONDS },
      );
      await redis.set(
        `pvp:${body.sessionId}:q`,
        JSON.stringify(body.questionIds),
        {
          ex: 3600,
        },
      );

      return NextResponse.json({ ok: true });
    }

    if (body.action === "claim") {
      if (!body.sessionId) {
        return NextResponse.json(
          { error: "Missing sessionId" },
          { status: 400 },
        );
      }
      await clearPendingSession(body.sessionId);
      return NextResponse.json({ ok: true });
    }

    if (!body.playerAddress) {
      return NextResponse.json(
        { error: "Missing playerAddress" },
        { status: 400 },
      );
    }

    const pending = await readPendingSession();
    const usablePending = await ensurePendingSessionIsUsable(
      pending,
      body.playerAddress,
    );

    if (usablePending) {
      return NextResponse.json(usablePending);
    }

    const questionIds = await getRandomQuestionIds();
    return NextResponse.json({ action: "create", questionIds });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
