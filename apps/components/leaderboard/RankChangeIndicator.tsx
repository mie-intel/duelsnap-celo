"use client";

import { motion } from "framer-motion";

interface RankChangeIndicatorProps {
  change: number; // positive = moved up, negative = moved down, 0 = no change
}

export function RankChangeIndicator({ change }: RankChangeIndicatorProps) {
  if (change === 0) {
    return (
      <span className="text-[10px] font-mono text-text-secondary/40" aria-label="No rank change">
        —
      </span>
    );
  }

  const isUp = change > 0;
  const abs = Math.abs(change);

  return (
    <motion.div
      className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${
        isUp ? "text-primary" : "text-error"
      }`}
      initial={{ opacity: 0, y: isUp ? 4 : -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      aria-label={`Rank ${isUp ? "up" : "down"} ${abs}`}
    >
      <svg
        viewBox="0 0 8 8"
        className="w-2 h-2 shrink-0"
        fill="currentColor"
        aria-hidden="true"
      >
        {isUp ? (
          <polygon points="4,0 8,8 0,8" />
        ) : (
          <polygon points="0,0 8,0 4,8" />
        )}
      </svg>
      <span>{abs}</span>
    </motion.div>
  );
}
