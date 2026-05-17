"use client";

import { useSwitchChain } from "wagmi";
import { celo } from "../../lib/viem/chain";

import { useWallet } from "../../hooks/useWallet";
import Button from "../ui/Button";

export function NetworkGuard() {
  const { chainId, isConnected } = useWallet();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === celo.id) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-900/80 border-b border-red-700 p-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <span className="text-sm text-red-100">
          Wrong network. Switch to Celo.
        </span>
        <Button
          onClick={() => switchChain({ chainId: celo.id })}
          disabled={isPending}
          className="text-xs"
        >
          {isPending ? "Switching..." : "Switch"}
        </Button>
      </div>
    </div>
  );
}
