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
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
          PvP Ranked
        </p>
        <h2 className="font-display font-bold text-2xl text-text-primary">
          Find an Opponent
        </h2>
        <p className="text-text-secondary text-sm font-sans mt-1">
          10 questions · First to 7 wins · CELO or cUSD wager
        </p>
      </div>

      <WagerPicker selected={wager} onChange={setWager} />

      <div className="flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3">
        <span className="text-text-secondary text-sm font-sans">You wager</span>
        <span className="font-display font-bold text-secondary">{wager} CELO / cUSD</span>
      </div>

      {/* Fee breakdown */}
      <div className="rounded-xl border border-border-subtle bg-surface-1 divide-y divide-border-subtle text-xs font-sans">
        {[
          { label: "Winner receives", value: `${(wager * 2 * 0.87).toFixed(3)} CELO / cUSD`, accent: true },
          { label: "Creator pool (10%)", value: `${(wager * 2 * 0.10).toFixed(3)} CELO / cUSD`, accent: false },
          { label: "Protocol treasury (3%)", value: `${(wager * 2 * 0.03).toFixed(3)} CELO / cUSD`, accent: false },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-text-secondary">{row.label}</span>
            <span className={`font-mono font-bold ${row.accent ? "text-primary" : "text-text-secondary"}`}>{row.value}</span>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={() => onStart(wager)}
        whileTap={{ scale: 0.98, y: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full py-4 rounded-2xl bg-primary text-text-inverse font-display font-bold text-base min-h-[52px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-[0_0_20px_rgba(53,208,127,0.25)]"
      >
        Find Opponent
      </motion.button>

      <div className="flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] text-text-secondary/50 uppercase tracking-widest">Powered by Celo</span>
      </div>
    </motion.div>
  );
}
