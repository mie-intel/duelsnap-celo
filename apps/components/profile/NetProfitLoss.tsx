"use client";

import { motion } from "framer-motion";

interface NetProfitLossProps {
  netProfitLoss: number;
}

export default function NetProfitLoss({ netProfitLoss }: NetProfitLossProps) {
  const isPositive = netProfitLoss >= 0;
  const formatted = `${isPositive ? "+" : ""}${netProfitLoss.toFixed(4)}`;
  const color = isPositive ? "var(--color-primary)" : "var(--color-error)";

  return (
    <div className="bg-[var(--color-bg-card)] rounded-[2rem] border border-[var(--color-border-subtle)] p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
          Net P&L
        </p>
        <span className="text-[9px] font-mono text-[var(--color-text-secondary)]/50 uppercase tracking-widest">
          CELO + cUSD
        </span>
      </div>
      <div className="flex items-end gap-2">
        <motion.p
          className="font-display font-bold text-3xl"
          style={{ color }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
        >
          {formatted}
        </motion.p>
        <span className="text-[var(--color-text-secondary)] text-sm font-sans mb-1">CELO</span>
      </div>
      <p className="text-[var(--color-text-secondary)] text-xs font-sans mt-1">
        {isPositive ? "Profit from paid games on Celo" : "Loss from paid games on Celo"}
      </p>

      {/* USD estimate */}
      <p className="text-[var(--color-text-secondary)]/50 text-[10px] font-mono mt-0.5">
        ≈ ${(Math.abs(netProfitLoss) * 0.62).toFixed(2)} USD
      </p>

      {/* cUSD royalty indicator */}
      <div className="mt-3 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
        <span className="text-[9px] text-[var(--color-text-secondary)]/50 uppercase tracking-widest font-bold">
          cUSD royalties · stablecoin earnings included
        </span>
      </div>

      {/* Contextual note */}
      <div className="mt-2 pt-3 border-t border-[var(--color-border-subtle)] flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[9px] text-[var(--color-text-secondary)]/40 uppercase tracking-widest font-bold">
          Settled on Celo · Blockscout verified
        </span>
      </div>
    </div>
  );
}
