import type { WalletClient } from "viem";
import { celo } from "./chain";

export async function ensureBaseSepoliaChain(walletClient: WalletClient) {
  let currentChainId: number;
  try {
    currentChainId = await walletClient.getChainId();
  } catch {
    return;
  }
  if (currentChainId === celo.id) return;

  const chainIdHex = `0x${celo.id.toString(16)}`;

  try {
    await walletClient.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/4902|Unrecognized chain|not added/i.test(message)) throw error;

    await walletClient.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdHex,
          chainName: celo.name,
          nativeCurrency: celo.nativeCurrency,
          rpcUrls: celo.rpcUrls.default.http,
          blockExplorerUrls: [celo.blockExplorers.default.url],
        },
      ],
    });
  }
}

export { ensureBaseSepoliaChain as ensureCeloChain };
