"use client";

import { useEffect, useState } from "react";
import { useSwitchChain } from "wagmi";
import { chains, getChainConfig } from "../../lib/chains";
import Button from "../ui/Button";

export function NetworkSwitcher() {
  const { switchChain, isPending } = useSwitchChain();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show if multiple chains are enabled
  if (!mounted || chains.length <= 1) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {chains.map((chain) => (
        <Button
          key={chain.id}
          variant="outline"
          size="sm"
          onClick={() => switchChain({ chainId: chain.id })}
          disabled={isPending}
          className="text-xs"
        >
          {chain.name}
        </Button>
      ))}
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
    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs">
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      {chain.name}
    </div>
  );
}
