"use client";

import { useCallback } from "react";
import type { Abi, ContractFunctionName, ContractFunctionArgs } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { celo } from "../lib/viem/chain";

type WriteContractParams<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, "nonpayable" | "payable">,
> = {
  address: `0x${string}`;
  abi: TAbi;
  functionName: TFunctionName;
  args?: ContractFunctionArgs<TAbi, "nonpayable" | "payable", TFunctionName>;
  value?: bigint;
};

export function useContractWriteWagmi() {
  const {
    writeContract,
    data: hash,
    isPending,
    isError,
    error,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const write = useCallback(
    async <
      TAbi extends Abi,
      TFunctionName extends ContractFunctionName<
        TAbi,
        "nonpayable" | "payable"
      >,
    >(
      params: WriteContractParams<TAbi, TFunctionName>,
    ) => {
      writeContract({
        address: params.address,
        abi: params.abi,
        functionName: params.functionName as unknown as string,
        args: params.args,
        value: params.value,
        chain: celo,
      } as any);
    },
    [writeContract],
  );

  return {
    write,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    status,
  };
}
