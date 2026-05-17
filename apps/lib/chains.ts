import { defineChain } from "viem";

const celoRpcUrl =
  process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org";
const celoExplorerUrl =
  process.env.NEXT_PUBLIC_CELO_EXPLORER_URL ?? "https://celoscan.io";

export const celo = defineChain({
  id: 42220,
  name: "Celo",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: { http: [celoRpcUrl] },
  },
  blockExplorers: {
    default: { name: "CeloScan", url: celoExplorerUrl },
  },
});

export const chains = [celo] as const;

export const chainMap = {
  celo,
} as const;

export function getChainConfig(chainId: number) {
  return chainId === celo.id ? celo : null;
}
