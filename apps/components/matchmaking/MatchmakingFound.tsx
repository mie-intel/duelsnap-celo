"use client";

import { motion } from "framer-motion";
import type { OpponentInfo } from "../../app/useMatchmaking";
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
      {/* Header */}
      <div className="text-center">
        <motion.p
          className="text-xs font-bold uppercase tracking-widest text-primary mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Opponent Found
        </motion.p>
        <motion.h2
          className="font-display font-bold text-2xl text-text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
        >
          Get Ready
        </motion.h2>
      </div>

      {/* Opponent card */}
      <OpponentCard opponent={opponent} />

      {/* Wager confirmation */}
      <motion.div
        className="flex items-center justify-between rounded-2xl border border-secondary/30 bg-secondary/5 px-4 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <span className="text-text-secondary text-sm font-sans">Wager locked</span>
        <span className="font-display font-bold text-secondary">{wager} CELO</span>
      </motion.div>

      {/* Auto-starting indicator */}
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
