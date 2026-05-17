import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  encodePacked,
  keccak256,
  toBytes,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { celo } from "../lib/viem/chain";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const CELO_RPC = process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org";
const EXPLORER = process.env.NEXT_PUBLIC_CELO_EXPLORER_URL ?? "https://celoscan.io";
const CASUAL_POOL = process.env.NEXT_PUBLIC_CASUAL_POOL_ADDRESS as `0x${string}`;
const QUESTION_POOL = process.env.NEXT_PUBLIC_QUESTION_POOL_ADDRESS as `0x${string}`;
const GAME_SESSION = process.env.NEXT_PUBLIC_GAME_SESSION_ADDRESS as `0x${string}`;

const NUM_WALLETS = 6;
const GAMES_PER_WALLET = 1;
const FEE = parseEther("0.01");
const GAS_BUFFER = parseEther("0.14"); // gas volatile on Celo, pad generously
const FUND_PER_WALLET = FEE * BigInt(GAMES_PER_WALLET) + GAS_BUFFER;
const MAX_TOTAL = parseEther("1");

const casualPoolAbi = [
  {
    type: "function",
    name: "payAndPlay",
    inputs: [{ name: "questionIds", type: "uint256[]" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "FEE_AMOUNT",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

const questionPoolAbi = [
  {
    type: "function",
    name: "getRandomQuestions",
    inputs: [
      { name: "count", type: "uint256" },
      { name: "seed", type: "uint256" },
    ],
    outputs: [{ name: "result", type: "uint256[]" }],
    stateMutability: "view",
  },
] as const;

const transferAbi = [
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

function randomSeed(): bigint {
  return BigInt(Math.floor(Math.random() * 1_000_000));
}

async function main() {
  const mainAccount = privateKeyToAccount(
    process.env.FAUCET_PRIVATE_KEY as `0x${string}`
  );

  const publicClient = createPublicClient({ chain: celo, transport: http(CELO_RPC) });
  const mainWallet = createWalletClient({ account: mainAccount, chain: celo, transport: http(CELO_RPC) });

  const mainBalance = await publicClient.getBalance({ address: mainAccount.address });
  console.log(`Main wallet: ${mainAccount.address}`);
  console.log(`Main balance: ${Number(mainBalance) / 1e18} CELO`);

  const totalNeeded = FUND_PER_WALLET * BigInt(NUM_WALLETS);
  console.log(`\nTotal needed: ${Number(totalNeeded) / 1e18} CELO (budget: ${Number(MAX_TOTAL) / 1e18} CELO)`);

  if (totalNeeded > MAX_TOTAL) throw new Error(`Exceeds 1 CELO budget`);
  if (mainBalance < totalNeeded) throw new Error(`Insufficient main balance`);

  // Generate wallets
  console.log(`\nGenerating ${NUM_WALLETS} wallets...`);
  const wallets: { privateKey: `0x${string}`; address: `0x${string}` }[] = [];
  for (let i = 0; i < NUM_WALLETS; i++) {
    const pk = generatePrivateKey();
    const acc = privateKeyToAccount(pk);
    wallets.push({ privateKey: pk, address: acc.address });
    console.log(`  Wallet ${i + 1}: ${acc.address}`);
  }

  // Fund wallets
  console.log(`\nFunding wallets (${Number(FUND_PER_WALLET) / 1e18} CELO each)...`);
  for (const w of wallets) {
    const hash = await mainWallet.sendTransaction({
      to: w.address,
      value: FUND_PER_WALLET,
    });
    await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    console.log(`  Funded ${w.address} | tx: ${EXPLORER}/tx/${hash}`);
  }

  // Each wallet plays casual games
  console.log(`\nPlaying casual games (${GAMES_PER_WALLET} games/wallet)...`);
  for (let i = 0; i < wallets.length; i++) {
    const w = wallets[i];
    const account = privateKeyToAccount(w.privateKey);
    const walletClient = createWalletClient({ account, chain: celo, transport: http(CELO_RPC) });

    console.log(`\n  Wallet ${i + 1} (${w.address}):`);

    for (let g = 0; g < GAMES_PER_WALLET; g++) {
      const seed = randomSeed();
      const questionIds = await publicClient.readContract({
        address: QUESTION_POOL,
        abi: questionPoolAbi,
        functionName: "getRandomQuestions",
        args: [5n, seed],
      });

      console.log(`    Game ${g + 1}: questions [${questionIds.join(", ")}]`);

      try {
        const hash = await walletClient.writeContract({
          address: CASUAL_POOL,
          abi: casualPoolAbi,
          functionName: "payAndPlay",
          args: [questionIds as unknown as bigint[]],
          value: FEE,
        });
        await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
        console.log(`    tx: ${EXPLORER}/tx/${hash}`);
      } catch (err) {
        console.log(`    FAILED: ${(err as Error).message?.split("\n")[0]}`);
      }
    }
  }

  // Summary
  console.log("\n=== Summary ===");
  for (let i = 0; i < wallets.length; i++) {
    const bal = await publicClient.getBalance({ address: wallets[i].address });
    console.log(`Wallet ${i + 1}: ${wallets[i].address} | remaining: ${Number(bal) / 1e18} CELO`);
  }

  const mainFinal = await publicClient.getBalance({ address: mainAccount.address });
  console.log(`\nMain wallet remaining: ${Number(mainFinal) / 1e18} CELO`);
  console.log("Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
