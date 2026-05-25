/**
 * test-casual-v3.ts
 * Simulate casual game transactions from N random wallets.
 * Deployer funds each wallet → each wallet plays → sweep sisa CELO balik.
 *
 * Usage:
 *   bun run scripts/test-casual-v3.ts [options]
 *
 * Options:
 *   --games N          Jumlah game (= jumlah wallet random) [default: 3]
 *   --concurrent N     Max wallet jalan parallel [default: 3]
 *   --delay-min N      Min delay antar game per wallet ms [default: 1000]
 *   --delay-max N      Max delay antar game per wallet ms [default: 4000]
 *   --sweep            Sweep sisa CELO balik ke deployer setelah selesai
 *   --no-sweep         Jangan sweep (default: sweep)
 *   --cusd             Pakai cUSD fee bukan native CELO
 *
 * Env (sc/.env):
 *   DEPLOYER_PRIVATE_KEY — funder wallet
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
  formatUnits,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { celo } from "../lib/viem/chain";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../sc/.env") });

// ── Config ────────────────────────────────────────────────────────────────────
const RPC = "https://forno.celo.org";
const EXPLORER = "https://celo.blockscout.com";

const CASUAL_POOL = "0x839fdf32e45A116EeFcFE3b1C4F892056057465c" as const;
const QUESTION_POOL = "0x9F80612d1621a92D2F14B4246BDAea33CFAb51d6" as const;
const CUSD = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;

// Parse args
const args = process.argv.slice(2);
const getArg = (flag: string, def: string) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
};

const GAMES       = parseInt(getArg("--games", "3"));
const CONCURRENT  = parseInt(getArg("--concurrent", "3"));
const DELAY_MIN   = parseInt(getArg("--delay-min", "1000"));
const DELAY_MAX   = parseInt(getArg("--delay-max", "4000"));
const USE_CUSD    = args.includes("--cusd");
const DO_SWEEP    = !args.includes("--no-sweep");

const CELO_FEE     = parseEther("0.01"); // fee per game (fixed)
const GAS_LIMIT_TX = 200_000n;           // gas limit untuk payAndPlay

// FUND_AMOUNT & TX_GAS_PRICE dihitung dinamis di main() berdasarkan gasPrice real-time
let FUND_AMOUNT  = parseEther("0.05");   // placeholder, diupdate di main()
let TX_GAS_PRICE = 0n;                   // placeholder, diupdate di main()

// Deployer address — set di main(), dipakai sweepWallet()
let DEPLOYER_ADDRESS: `0x${string}` = "0x0000000000000000000000000000000000000000";

// ── ABIs ─────────────────────────────────────────────────────────────────────
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
    name: "payAndPlayWithCUSD",
    inputs: [{ name: "questionIds", type: "uint256[]" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "feeAmountCUSD",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "VolumeTracked",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "cumulative", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CasualFeePaid",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "questionIds", type: "uint256[]", indexed: false },
    ],
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

const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────
function randDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((r) => setTimeout(r, ms));
}

function log(prefix: string, msg: string) {
  const time = new Date().toTimeString().slice(0, 8);
  console.log(`[${time}] ${prefix} ${msg}`);
}

// ── Fund satu wallet (harus dipanggil SEKUENSIAL dari deployer) ───────────────
async function fundWallet(
  gameIndex: number,
  address: `0x${string}`,
  pub: ReturnType<typeof createPublicClient>,
  deployerWallet: ReturnType<typeof createWalletClient>,
  deployerAccount: ReturnType<typeof privateKeyToAccount>,
  feeCUSD: bigint,
): Promise<void> {
  const prefix = `[${String(gameIndex + 1).padStart(2, "0")}/${GAMES}]`;

  log(prefix, `Funding ${address} | ${formatEther(FUND_AMOUNT)} CELO`);
  const fundHash = await deployerWallet.sendTransaction({
    to: address,
    value: FUND_AMOUNT,
    account: deployerAccount,
    chain: celo,
  });
  await pub.waitForTransactionReceipt({ hash: fundHash, timeout: 60_000 });
  log(prefix, `Funded ✓`);

  // cUSD: transfer cUSD ke wallet random juga (sekuensial)
  if (USE_CUSD && feeCUSD > 0n) {
    const cusdHash = await deployerWallet.writeContract({
      address: CUSD,
      abi: erc20Abi,
      functionName: "transfer",
      args: [address, feeCUSD],
      account: deployerAccount,
      chain: celo,
    });
    await pub.waitForTransactionReceipt({ hash: cusdHash, timeout: 60_000 });
    log(prefix, `cUSD sent: ${formatUnits(feeCUSD, 18)} ✓`);
  }
}

// ── Core: satu wallet main 1 game (dipanggil PARALLEL, wallet sudah funded) ──
async function runWalletGame(
  gameIndex: number,
  pk: `0x${string}`,
  pub: ReturnType<typeof createPublicClient>,
  feeCUSD: bigint,
): Promise<{ success: boolean; spent: bigint; address: string }> {
  const account = privateKeyToAccount(pk);
  const prefix = `[${String(gameIndex + 1).padStart(2, "0")}/${GAMES}]`;

  // Delay random biar organic (sebelum main)
  await randDelay(DELAY_MIN, DELAY_MAX);

  // Wallet random bikin sendiri walletClient
  const walletRand = createWalletClient({ account, chain: celo, transport: http(RPC) });

  // Fetch random questions
  const seed = BigInt(Math.floor(Math.random() * 1_000_000_000));
  const questionIds = (await pub.readContract({
    address: QUESTION_POOL,
    abi: questionPoolAbi,
    functionName: "getRandomQuestions",
    args: [5n, seed],
  })) as bigint[];

  log(prefix, `Questions: [${questionIds.slice(0, 3).join(", ")}…]`);

  let hash: `0x${string}`;
  const balBefore = await pub.getBalance({ address: account.address });

  // Gunakan legacy gasPrice (bukan EIP-1559) agar viem tidak pakai maxFeePerGas
  // yang bisa 2× baseFee dan bikin pre-flight check gagal
  const txParams = {
    gasPrice: TX_GAS_PRICE,
    gas: GAS_LIMIT_TX,
  };

  try {
    if (USE_CUSD) {
      // cUSD: approve dulu
      const cusdApproveHash = await walletRand.writeContract({
        address: CUSD,
        abi: erc20Abi,
        functionName: "approve",
        args: [CASUAL_POOL, feeCUSD],
        account,
        chain: celo,
        gas: 100_000n,
        gasPrice: TX_GAS_PRICE,
      });
      await pub.waitForTransactionReceipt({ hash: cusdApproveHash, timeout: 60_000 });

      hash = await walletRand.writeContract({
        address: CASUAL_POOL,
        abi: casualPoolAbi,
        functionName: "payAndPlayWithCUSD",
        args: [questionIds],
        account,
        chain: celo,
        ...txParams,
      });
    } else {
      hash = await walletRand.writeContract({
        address: CASUAL_POOL,
        abi: casualPoolAbi,
        functionName: "payAndPlay",
        args: [questionIds],
        value: CELO_FEE,
        account,
        chain: celo,
        ...txParams,
      });
    }

    const receipt = await pub.waitForTransactionReceipt({ hash, timeout: 60_000 });

    if (receipt.status === "reverted") {
      log(prefix, `REVERTED | ${EXPLORER}/tx/${hash}`);
      if (DO_SWEEP) await sweepWallet(account, DEPLOYER_ADDRESS, pub, prefix);
      return { success: false, spent: FUND_AMOUNT, address: account.address };
    }

    log(prefix, `OK | ${EXPLORER}/tx/${hash}`);

    if (DO_SWEEP) await sweepWallet(account, DEPLOYER_ADDRESS, pub, prefix);

    const balAfter = await pub.getBalance({ address: account.address });
    return {
      success: true,
      spent: FUND_AMOUNT - balAfter,
      address: account.address,
    };
  } catch (err) {
    log(prefix, `FAILED: ${(err as Error).message?.split("\n")[0]}`);
    if (DO_SWEEP) await sweepWallet(account, DEPLOYER_ADDRESS, pub, prefix);
    return { success: false, spent: FUND_AMOUNT, address: account.address };
  }
}

// ── Sweep sisa CELO dari wallet random balik ke deployer ─────────────────────
async function sweepWallet(
  account: ReturnType<typeof privateKeyToAccount>,
  toAddress: `0x${string}`,
  pub: ReturnType<typeof createPublicClient>,
  prefix: string,
) {
  const bal = await pub.getBalance({ address: account.address });
  if (bal <= parseEther("0.001")) return; // dust, skip

  // Pakai TX_GAS_PRICE yang sudah dihitung di main()
  const gasLimit = 21_000n;
  const gasCost = TX_GAS_PRICE * gasLimit;
  const sendAmount = bal - gasCost;

  if (sendAmount <= 0n) return;

  try {
    const walletRand = createWalletClient({ account, chain: celo, transport: http(RPC) });
    const sweepHash = await walletRand.sendTransaction({
      to: toAddress,
      value: sendAmount,
      account,
      chain: celo,
      gas: gasLimit,
      gasPrice: TX_GAS_PRICE,
    });
    await pub.waitForTransactionReceipt({ hash: sweepHash, timeout: 30_000 });
    log(prefix, `Swept ${formatEther(sendAmount)} CELO back`);
  } catch {
    log(prefix, `Sweep failed (dust left)`);
  }
}

// ── Semaphore sederhana buat limit concurrent ─────────────────────────────────
class Semaphore {
  private queue: (() => void)[] = [];
  private active = 0;

  constructor(private limit: number) {}

  async acquire(): Promise<void> {
    if (this.active < this.limit) {
      this.active++;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
    this.active++;
  }

  release(): void {
    this.active--;
    const next = this.queue.shift();
    if (next) next();
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const deployerPk = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
  if (!deployerPk) throw new Error("DEPLOYER_PRIVATE_KEY not set in sc/.env");

  const deployerAccount = privateKeyToAccount(deployerPk);
  const pub = createPublicClient({ chain: celo, transport: http(RPC) });
  const deployerWallet = createWalletClient({
    account: deployerAccount,
    chain: celo,
    transport: http(RPC),
  });

  const deployerBal = await pub.getBalance({ address: deployerAccount.address });

  // ── Hitung gas price real-time ──
  // Pakai gasPrice (legacy), bukan EIP-1559 maxFeePerGas, untuk menghindari
  // viem pre-flight check yang overestimate cost.
  const currentGasPrice = await pub.getGasPrice();
  TX_GAS_PRICE = currentGasPrice * 130n / 100n; // +30% buffer biar tx cepat masuk

  // Fund per wallet = fee game + gas cost actual
  const gasCostPerTx = GAS_LIMIT_TX * TX_GAS_PRICE;
  FUND_AMOUNT = CELO_FEE + gasCostPerTx + parseEther("0.002"); // +0.002 spare

  console.log(`\n══════════ DuelSnap Multi-Wallet Sim ══════════`);
  console.log(`Deployer:    ${deployerAccount.address}`);
  console.log(`CELO bal:    ${formatEther(deployerBal)} CELO`);
  console.log(`Games:       ${GAMES}`);
  console.log(`Concurrent:  ${CONCURRENT}`);
  console.log(`Mode:        ${USE_CUSD ? "cUSD" : "native CELO"}`);
  console.log(`Sweep back:  ${DO_SWEEP ? "yes" : "no"}`);
  console.log(`Delay:       ${DELAY_MIN}–${DELAY_MAX}ms`);
  console.log(`Gas price:   ${Number(TX_GAS_PRICE) / 1e9} gwei (incl. 30% buffer)`);
  console.log(`Fund/wallet: ${formatEther(FUND_AMOUNT)} CELO`);

  // Total CELO dibutuhkan
  const totalFund = FUND_AMOUNT * BigInt(GAMES);
  console.log(`\nTotal fund needed: ~${formatEther(totalFund)} CELO`);

  if (deployerBal < totalFund + parseEther("0.05")) {
    throw new Error(
      `Deployer balance insufficient.\n  Need: ~${formatEther(totalFund + parseEther("0.05"))}\n  Have: ${formatEther(deployerBal)}`
    );
  }

  // cUSD: fetch fee
  let feeCUSD = 0n;
  if (USE_CUSD) {
    feeCUSD = (await pub.readContract({
      address: CASUAL_POOL,
      abi: casualPoolAbi,
      functionName: "feeAmountCUSD",
    })) as bigint;
    console.log(`cUSD fee/game: ${formatUnits(feeCUSD, 18)}`);
  }

  // Set global deployer address (dipakai sweepWallet)
  DEPLOYER_ADDRESS = deployerAccount.address;

  // Generate N wallet random
  console.log(`\nGenerating ${GAMES} random wallets...`);
  const walletKeys: `0x${string}`[] = Array.from({ length: GAMES }, () =>
    generatePrivateKey()
  );
  walletKeys.forEach((pk, i) => {
    const addr = privateKeyToAccount(pk).address;
    console.log(`  Wallet ${String(i + 1).padStart(2, "0")}: ${addr}`);
  });

  // ── Phase 1: Fund semua wallet SEKUENSIAL dari deployer ──
  // Satu per satu biar nonce deployer tidak konflik
  console.log(`\n─── Phase 1: Funding ${GAMES} wallets (sequential) ───`);
  for (let i = 0; i < walletKeys.length; i++) {
    const addr = privateKeyToAccount(walletKeys[i]).address;
    await fundWallet(i, addr, pub, deployerWallet, deployerAccount, feeCUSD);
  }

  // ── Phase 2: Semua wallet main PARALLEL ──
  // Tiap wallet punya nonce sendiri (fresh wallet, mulai dari 0)
  console.log(`\n─── Phase 2: Playing ${GAMES} games (${CONCURRENT} concurrent) ───`);
  const sem = new Semaphore(CONCURRENT);
  const results: { success: boolean; spent: bigint; address: string }[] = [];

  const tasks = walletKeys.map((pk, i) =>
    (async () => {
      await sem.acquire();
      try {
        const result = await runWalletGame(i, pk, pub, feeCUSD);
        results.push(result);
      } finally {
        sem.release();
      }
    })()
  );

  await Promise.all(tasks);

  // Summary
  const success = results.filter((r) => r.success).length;
  const failed  = results.length - success;
  const totalSpent = results.reduce((s, r) => s + r.spent, 0n);

  const finalBal = await pub.getBalance({ address: deployerAccount.address });

  console.log(`\n══════════ Summary ══════════`);
  console.log(`Games OK:    ${success}/${GAMES}`);
  console.log(`Games FAIL:  ${failed}/${GAMES}`);
  console.log(`CELO spent:  ${formatEther(deployerBal - finalBal)} CELO (net)`);
  console.log(`Deployer bal: ${formatEther(finalBal)} CELO`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
