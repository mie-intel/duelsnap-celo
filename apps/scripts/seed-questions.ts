import { PinataSDK } from "pinata";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEventLogs,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "../lib/viem/chain";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const CELO_RPC =
  process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org";
const GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://gateway.pinata.cloud";

const questionPoolAddress = process.env
  .NEXT_PUBLIC_QUESTION_POOL_ADDRESS as `0x${string}`;

const questionPoolAbi = [
  {
    type: "function",
    name: "submitQuestion",
    inputs: [{ name: "ipfsHash", type: "string" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyQuestion",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "difficulty", type: "uint8" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "questionCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "QuestionSubmitted",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "contributor", type: "address", indexed: true },
    ],
  },
] as const;

async function main() {
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: GATEWAY,
  });
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  const explorerUrl =
    process.env.NEXT_PUBLIC_CELO_EXPLORER_URL ?? "https://celoscan.io";

  const account = privateKeyToAccount(
    process.env.FAUCET_PRIVATE_KEY as `0x${string}`,
  );
  const publicClient = createPublicClient({
    chain: celo,
    transport: http(CELO_RPC),
  });
  const walletClient = createWalletClient({
    account,
    chain: celo,
    transport: http(CELO_RPC),
  });

  const imagesDir = path.join(__dirname, "seed-data/images");

  console.log(`questionPoolAddress: ${questionPoolAddress}`);
  console.log(`account: ${account.address}`);
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`CELO balance: ${balance}`);
  try {
    const qCount = await publicClient.readContract({
      address: questionPoolAddress,
      abi: questionPoolAbi,
      functionName: "questionCount",
    });
    console.log(`questionCount: ${qCount}`);
  } catch (e) {
    console.log(
      `questionCount read FAILED: ${e instanceof Error ? e.message : e}`,
    );
  }

  const answersPath = path.join(__dirname, "seed-data/answers.json");
  const answersRaw: Record<string, string> = JSON.parse(
    fs.readFileSync(answersPath, "utf8"),
  );

  for (const [filename, answer] of Object.entries(answersRaw)) {
    const imagePath = path.join(imagesDir, filename);
    if (!fs.existsSync(imagePath)) {
      console.log(`SKIP ${filename} — file not found`);
      continue;
    }

    console.log(`\nProcessing: ${filename} → ${answer}`);

    const buffer = fs.readFileSync(imagePath);
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const mime = mimeMap[ext] ?? "image/jpeg";
    const file = new File([buffer], filename, { type: mime });
    const result = await pinata.upload.public.file(file);
    const cid = result.cid;
    const imageUrl = `${GATEWAY}/ipfs/${cid}`;
    console.log(`  Uploaded to IPFS: ${cid}`);

    // Debug: simulate to get actual revert reason
    try {
      const simResult = await publicClient.simulateContract({
        address: questionPoolAddress,
        abi: questionPoolAbi,
        functionName: "submitQuestion",
        args: [cid],
        account: account.address,
      });
      console.log(`  Simulate OK, would return id: ${simResult.result}`);
    } catch (simErr: unknown) {
      const e = simErr as Record<string, unknown>;
      console.log(`  SIMULATE REVERT msg: ${(simErr as Error).message}`);
      if (e.cause) console.log(`  SIMULATE REVERT cause:`, e.cause);
      if (e.data) console.log(`  SIMULATE REVERT data:`, e.data);
      continue;
    }

    const submitHash = await walletClient.writeContract({
      address: questionPoolAddress,
      abi: questionPoolAbi,
      functionName: "submitQuestion",
      args: [cid],
      gas: 500_000n,
    });
    console.log(`  Submit tx: ${explorerUrl}/tx/${submitHash}`);
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: submitHash,
      timeout: 120_000,
    });
    console.log(`  tx status: ${receipt.status}, logs: ${receipt.logs.length}`);
    if (receipt.logs.length > 0)
      console.log(`  first log topics:`, receipt.logs[0].topics);
    const logs = parseEventLogs({
      abi: questionPoolAbi,
      eventName: "QuestionSubmitted",
      logs: receipt.logs,
    });
    const questionId = Number(logs[0]?.args?.id ?? 0);
    if (!questionId) {
      console.log(`  ERROR: no questionId`);
      continue;
    }
    console.log(`  Submitted on-chain: ID ${questionId}`);

    const verifyHash = await walletClient.writeContract({
      address: questionPoolAddress,
      abi: questionPoolAbi,
      functionName: "verifyQuestion",
      args: [BigInt(questionId), 2],
      gas: 500_000n,
    });
    console.log(`  Verify tx: ${explorerUrl}/tx/${verifyHash}`);
    await publicClient.waitForTransactionReceipt({
      hash: verifyHash,
      timeout: 120_000,
    });
    console.log(`  Verified`);

    await Promise.all([
      redis.set(`question:${questionId}:answer`, answer.toUpperCase()),
      redis.set(`question:${questionId}:imageUrl`, imageUrl),
    ]);
    console.log(`  Stored in Redis: question:${questionId}:*`);
  }

  console.log("\nDone!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
