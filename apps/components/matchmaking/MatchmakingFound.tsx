"use client";

import { motion } from "framer-motion";
import type { OpponentInfo } from "../../hooks/useMatchmaking";
import { OpponentCard } from "./OpponentCard";

interface MatchmakingFoundProps {
  opponent: OpponentInfo;
  wager: number;
}

export function MatchmakingFound({ opponent, wager }: MatchmakingFoundProps) {
  return (
    <motion.div
      key="found"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="space-y-5"
    >
      <div className="text-center">
        <motion.p
          className="text-xs font-bold uppercase tracking-widest text-primary mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Challenger locked in ⚔️
        </motion.p>
        <motion.h2
          className="font-display font-bold text-2xl text-text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
        >
          May the best guesser win!
        </motion.h2>
      </div>

      <OpponentCard opponent={opponent} />

      <motion.div
        className="flex items-center justify-between rounded-2xl border border-secondary/30 bg-secondary/5 px-4 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <span className="text-text-secondary text-sm font-sans">Wager locked on Celo</span>
        <span className="font-display font-bold text-secondary">{wager} CELO</span>
      </motion.div>

      <motion.div
        className="rounded-xl border border-border-subtle bg-surface-1 px-4 py-2.5 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true">
          <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="text-xs text-text-secondary flex-1">
          Wager escrowed on-chain · settled on Celo after match
        </span>
        <a
          href="https://celo.blockscout.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-primary hover:underline font-mono shrink-0"
        >
          Blockscout ↗
        </a>
      </motion.div>

      <motion.p
        className="text-center text-text-secondary text-xs font-sans"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        Starting automatically…
      </motion.p>
    </motion.div>
  );
}
