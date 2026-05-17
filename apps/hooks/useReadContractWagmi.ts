"use client";

import type { Abi, ContractFunctionName } from "viem";
import { useReadContract as useReadContractWagmi } from "wagmi";
import { celo } from "../lib/viem/chain";

type ReadContractParams = {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: any[];
};

export function useReadContract(params: ReadContractParams) {
  return useReadContractWagmi({
    address: params.address,
    abi: params.abi,
    functionName: params.functionName as ContractFunctionName<Abi>,
    args: params.args,
    chainId: celo.id,
  });
}
