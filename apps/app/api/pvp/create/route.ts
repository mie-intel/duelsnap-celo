import { NextResponse } from "next/server";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEventLogs,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { redis } from "../../../../lib/redis/client";
import { baseSepolia } from "../../../../lib/viem/chain";
import { publicClient } from "../../../../lib/viem/client";
import {
  gameSessionAbi,
  gameSessionContract,
  questionPoolContract,
} from "../../../../lib/viem/contracts";

const CELO_RPC =
  process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org";
const WAGER = parseUnits("5000", 2);

export async function POST(req: Request) {
  try {
    const { playerAddress } = await req.json();
    if (!playerAddress)
      return NextResponse.json(
        { error: "Missing playerAddress" },
        { status: 400 },
      );

    const seed = BigInt(Math.floor(Math.random() * 1e12));
    const ids = await publicClient.readContract({
      ...questionPoolContract,
      functionName: "getRandomQuestions",
      args: [10n, seed],
    });
    const questionIds = ids as bigint[];

    const faucetKey = process.env.FAUCET_PRIVATE_KEY;
    if (!faucetKey) throw new Error("Relayer key not configured");

    const account = privateKeyToAccount(faucetKey as `0x${string}`);
    const walletRelayer = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(CELO_RPC),
    });
    const pubClient = createPublicClient({
      chain: baseSepolia,
      transport: http(CELO_RPC),
    });
    const simulatedCreate = await pubClient.simulateContract({
      address: gameSessionContract.address,
      abi: gameSessionAbi,
      functionName: "createSession",
      args: [WAGER, questionIds],
      account,
    });
    const expectedSessionId = simulatedCreate.result;

    const hash = await walletRelayer.writeContract({
      address: gameSessionContract.address,
      abi: gameSessionAbi,
      functionName: "createSession",
      args: [WAGER, questionIds],
    });
    const receipt = await pubClient.waitForTransactionReceipt({ hash });

    let sessionId = expectedSessionId;
    try {
      const sessionLogs = parseEventLogs({
        abi: gameSessionAbi,
        eventName: "SessionCreated",
        logs: receipt.logs,
        strict: false,
      });
      sessionId = sessionLogs[0]?.args?.id ?? expectedSessionId;
    } catch {
      // Fall back to the simulated return value when log decoding is flaky.
    }
    if (!sessionId) throw new Error("Could not get sessionId from event");

    await redis.set(
      `pvp:${sessionId}:q`,
      JSON.stringify(questionIds.map(String)),
      { ex: 3600 },
    );

    return NextResponse.json({
      sessionId,
      questionIds: questionIds.map(String),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
