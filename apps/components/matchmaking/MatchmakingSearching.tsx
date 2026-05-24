"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const RadarPulse = memo(function RadarPulse() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/30"
          animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.65, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute inset-4 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-primary"
          aria-hidden="true"
        >
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <line x1="13" y1="19" x2="19" y2="13" />
          <line x1="16" y1="16" x2="20" y2="20" />
          <line x1="19" y1="21" x2="21" y2="19" />
          <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
          <line x1="5" y1="14" x2="9" y2="18" />
          <line x1="7" y1="17" x2="3" y2="21" />
        </svg>
      </motion.div>
    </div>
  );
});

interface MatchmakingSearchingProps {
  elapsed: number;
  wager: number;
  onCancel: () => void;
}

export function MatchmakingSearching({ elapsed, wager, onCancel }: MatchmakingSearchingProps) {
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const elapsedLabel =
    mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`;

  return (
    <motion.div
      key="searching"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="flex flex-col items-center gap-6 py-4"
    >
      <RadarPulse />
      <div className="text-center space-y-1">
        <h2 className="font-display font-bold text-xl text-text-primary">
          Finding Opponent…
        </h2>
        <p className="text-text-secondary text-sm font-sans">
          Wager: <span className="text-secondary font-bold">{wager} CELO / cUSD</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
        <span className="font-mono text-sm text-text-secondary">{elapsedLabel}</span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-1 border border-border-subtle">
        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] text-text-secondary/60 uppercase tracking-widest font-bold">Celo Mainnet</span>
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-semibold font-sans text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded px-4 py-2 min-h-[44px]"
      >
        Cancel
      </button>
    </motion.div>
  );
}
