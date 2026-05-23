"use client";

import { useEffect, useState } from "react";
import { useSwitchChain } from "wagmi";
import { chains, getChainConfig } from "../../lib/chains";
import Button from "../ui/Button";

const CELO_CHAIN_ID = 42220;

export function NetworkSwitcher() {
  const { switchChain, isPending } = useSwitchChain();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || chains.length <= 1) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {chains.map((chain) => {
        const isCelo = chain.id === CELO_CHAIN_ID;
        return (
          <Button
            key={chain.id}
            variant="outline"
            size="sm"
            onClick={() => switchChain({ chainId: chain.id })}
            disabled={isPending}
            className={`text-xs flex items-center gap-1.5 ${isCelo ? "text-primary border-primary/40" : ""}`}
          >
            {isCelo && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
            {chain.name}
          </Button>
        );
      })}
    </div>
  );
}

export function NetworkDisplay() {
  const [mounted, setMounted] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Get first chain as default
    if (chains.length > 0) {
      setCurrentChainId(chains[0].id);
    }
  }, []);

  if (!mounted || !currentChainId) {
    return null;
  }

  const chain = getChainConfig(currentChainId);
  if (!chain) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs bg-surface-1 border border-border-subtle text-text-primary">
      <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
      <span className="font-mono text-[11px]">{chain.name}</span>
      <span className="font-mono text-[11px] text-text-secondary">({chain.id})</span>
    </div>
  );
}
