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
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] mb-3">
        Net P&L
      </p>
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
        {isPositive ? "Profit from paid games" : "Loss from paid games"}
      </p>
    </div>
  );
}
