"use client";

import { useCapabilities, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useMemo } from "react";

export function useBaseAccountCapabilities() {
  const { address, connector } = useAccount();
  const { data: capabilities } = useCapabilities({ account: address });

  const supportsBatching = useMemo(() => {
    if (!capabilities) return false;
    // Check if wallet supports EIP-5792 batching (atomic multicall)
    return (
      Array.isArray(capabilities) &&
      capabilities.some((cap) => cap.type === "atomicBatch")
    );
  }, [capabilities]);

  const supportsPaymasterSponsorship = useMemo(() => {
    if (!capabilities) return false;
    // Check if wallet supports paymaster/gas sponsorship
    return (
      Array.isArray(capabilities) &&
      capabilities.some((cap) => cap.type === "paymasterService")
    );
  }, [capabilities]);

  const isBaseAccount = useMemo(() => {
    // Simple detection: Base Account shows up as a specific connector or capability
    return connector?.name?.toLowerCase().includes("base") ?? false;
  }, [connector]);

  return {
    supportsBatching,
    supportsPaymasterSponsorship,
    isBaseAccount,
    capabilities,
  };
}
