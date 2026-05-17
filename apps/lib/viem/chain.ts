import { defineChain } from 'viem';

const celoRpcUrl =
  process.env.NEXT_PUBLIC_CELO_RPC_URL ?? 'https://forno.celo.org';
const celoExplorerUrl =
  process.env.NEXT_PUBLIC_CELO_EXPLORER_URL ?? 'https://celoscan.io';

export const celo = defineChain({
  id: 42220,
  name: 'Celo',
  nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: [celoRpcUrl] },
  },
  blockExplorers: {
    default: { name: 'CeloScan', url: celoExplorerUrl },
  },
});

// Alias for backward compat across files still referencing baseSepolia
export const baseSepolia = celo;
