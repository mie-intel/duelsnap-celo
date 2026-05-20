"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { WagerPicker } from "./WagerPicker";

interface MatchmakingIdleProps {
  onStart: (wager: number) => void;
}

export function MatchmakingIdle({ onStart }: MatchmakingIdleProps) {
  const [wager, setWager] = useState(0.1);

  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
          PvP Ranked
        </p>
        <h2 className="font-display font-bold text-2xl text-text-primary">
          Find an Opponent
        </h2>
        <p className="text-text-secondary text-sm font-sans mt-1">
          10 questions · First to 7 wins · CELO wager
        </p>
      </div>

      {/* Wager picker */}
      <WagerPicker selected={wager} onChange={setWager} />

      {/* Summary row */}
      <div className="flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3">
        <span className="text-text-secondary text-sm font-sans">You wager</span>
        <span className="font-display font-bold text-secondary">
          {wager} CELO
        </span>
      </div>

      {/* Find button */}
      <motion.button
        type="button"
        onClick={() => onStart(wager)}
        whileTap={{ scale: 0.98, y: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full py-4 rounded-2xl bg-primary text-text-inverse font-display font-bold text-base min-h-[52px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-[0_0_20px_rgba(53,208,127,0.25)]"
      >
        Find Opponent
      </motion.button>
    </motion.div>
  );
}
