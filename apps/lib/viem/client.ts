import { createPublicClient, http } from 'viem';
import { celo } from './chain';

const celoRpcUrl =
  process.env.NEXT_PUBLIC_CELO_RPC_URL ?? 'https://forno.celo.org';

export const publicClient = createPublicClient({
  chain: celo,
  transport: http(celoRpcUrl),
});
