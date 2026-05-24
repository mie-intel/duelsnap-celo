"use client";

import { useCallback, useEffect, useState } from "react";
import { formatUnits } from "viem";
import type { Address } from "viem";
import { publicClient } from "../lib/viem/client";
import { CUSD_ADDRESS } from "../lib/viem/contracts";
import { erc20Abi } from "../lib/viem/erc20Abi";

const CASUAL_POOL_ADDRESS = (process.env.NEXT_PUBLIC_CASUAL_POOL_ADDRESS ??
  "0x839fdf32e45A116EeFcFE3b1C4F892056057465c") as `0x${string}`;

export function useCUSDBalance(address: Address | null) {
  const [balance, setBalance] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const [bal, alw] = await Promise.all([
        publicClient.readContract({
          address: CUSD_ADDRESS,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        }),
        publicClient.readContract({
          address: CUSD_ADDRESS,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address, CASUAL_POOL_ADDRESS],
        }),
      ]);
      setBalance(bal as bigint);
      setAllowance(alw as bigint);
    } catch {
      // RPC error — leave previous values
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15_000);
    return () => clearInterval(id);
  }, [refresh]);

  return {
    balance,
    allowance,
    balanceFormatted: Number(formatUnits(balance, 18)).toFixed(4),
    loading,
    refresh,
  };
}
