"use client";

import { getBaseScanTxUrl } from "../../lib/viem/basescan";
import Link from "next/link";

interface TxStatusProps {
  hash?: `0x${string}` | null;
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: Error | null;
}

export function TxStatus({
  hash,
  isPending,
  isConfirming,
  isSuccess,
  isError,
  error,
}: TxStatusProps) {
  if (!hash && !isPending && !isError) return null;

  return (
    <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
      {isPending && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-900">
            Waiting for signature...
          </span>
        </div>
      )}

      {isConfirming && hash && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-900">
            Confirming tx{" "}
            <Link
              href={getBaseScanTxUrl(hash)}
              target="_blank"
              className="underline hover:text-blue-700"
            >
              {hash.slice(0, 10)}...
            </Link>
          </span>
        </div>
      )}

      {isSuccess && hash && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-green-600">✓</div>
          <span className="text-sm text-green-900">
            Success{" "}
            <Link
              href={getBaseScanTxUrl(hash)}
              target="_blank"
              className="underline hover:text-green-700"
            >
              View on BaseScan
            </Link>
          </span>
        </div>
      )}

      {isError && error && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-red-600">✕</div>
          <div className="text-sm text-red-900">
            <p className="font-semibold">Error</p>
            <p className="text-xs">{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
