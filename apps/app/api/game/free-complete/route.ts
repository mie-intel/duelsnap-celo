import { NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from '../../../../lib/viem/chain';
import { questionPoolContract, questionPoolAbi } from '../../../../lib/viem/contracts';

const CELO_RPC =
  process.env.NEXT_PUBLIC_CELO_RPC_URL ?? 'https://forno.celo.org';

export async function POST(req: Request) {
  try {
    const { address } = await req.json();
    if (!address) return NextResponse.json({ error: 'Missing address' }, { status: 400 });

    const faucetKey = process.env.FAUCET_PRIVATE_KEY;
    if (!faucetKey) throw new Error('Relayer key not configured');

    const account = privateKeyToAccount(faucetKey as `0x${string}`);
    const walletClient = createWalletClient({ account, chain: baseSepolia, transport: http(CELO_RPC) });
    const publicClientServer = createPublicClient({ chain: baseSepolia, transport: http(CELO_RPC) });

    const hash = await walletClient.writeContract({
      address: questionPoolContract.address,
      abi: questionPoolAbi,
      functionName: 'incrementDailyCount',
      args: [address as `0x${string}`],
    });
    await publicClientServer.waitForTransactionReceipt({ hash });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
