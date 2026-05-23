"use client";

import Link from "next/link";

const BLOCKSCOUT_TX = "https://celo.blockscout.com/tx/";

function blockscoutUrl(hash: `0x${string}`) {
  return `${BLOCKSCOUT_TX}${hash}`;
}

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
    <div className="mt-2 p-3 rounded-xl bg-surface-1 border border-border-subtle">
      {isPending && (
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-sm text-text-secondary">Waiting for signature…</span>
        </div>
      )}

      {isConfirming && hash && (
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-sm text-text-secondary">
            Confirming on Celo…{" "}
            <Link
              href={blockscoutUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-primary hover:underline"
            >
              {hash.slice(0, 8)}…{hash.slice(-6)}
            </Link>
          </span>
        </div>
      )}

      {isSuccess && hash && (
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">✓</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text-primary font-medium">Transaction confirmed</span>
            <Link
              href={blockscoutUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden="true">
                <path d="M5 1.5H1.5v9h9V7M7 1.5h3.5v3.5M10.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              View on Blockscout
            </Link>
          </div>
        </div>
      )}

      {isError && error && (
        <div className="flex items-start gap-2.5">
          <span className="w-4 h-4 rounded-full bg-error/20 flex items-center justify-center text-error text-[10px] font-bold shrink-0 mt-0.5">✕</span>
          <div>
            <p className="text-sm font-semibold text-text-primary">Transaction failed</p>
            <p className="text-xs text-text-secondary mt-0.5 break-words max-w-[40ch]">{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
