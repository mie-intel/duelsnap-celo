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
    <div className="fixed top-0 left-0 right-0 z-[var(--z-toast)] bg-error/10 border-b border-error/30 backdrop-blur-sm p-3">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-error/20 flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-error" aria-hidden="true">
              <path d="M8 3v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-text-primary">Wrong network</span>
            <span className="text-xs text-text-secondary ml-2">Switch to Celo Mainnet (42220) to continue</span>
          </div>
        </div>
        <Button
          onClick={() => switchChain({ chainId: celo.id })}
          disabled={isPending}
          size="sm"
          className="text-xs shrink-0 bg-primary text-text-inverse hover:bg-primary-dark"
        >
          {isPending ? "Switching…" : "Switch to Celo"}
        </Button>
      </div>
    </div>
  );
}
