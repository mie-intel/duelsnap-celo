"use client";

import { motion } from "framer-motion";
import type { OpponentInfo } from "../../hooks/useMatchmaking";

interface OpponentCardProps {
  opponent: OpponentInfo;
}

export function OpponentCard({ opponent }: OpponentCardProps) {
  const initials = opponent.address.slice(2, 4).toUpperCase();
  const total = opponent.wins + opponent.losses;
  const winBarWidth = `${opponent.winRate}%`;

  return (
    <motion.div
      className="rounded-[1.5rem] border border-primary/30 bg-primary/5 p-4 space-y-4"
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
      style={{ boxShadow: "0 0 20px rgba(53,208,127,0.12)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-display font-bold text-primary text-base shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm font-medium text-text-primary truncate">
            {opponent.address}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-live-pulse" />
            <span className="text-[10px] font-sans text-primary/70 uppercase tracking-wider">
              Online
            </span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 shrink-0">
          <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-primary">
            Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-display font-bold text-base text-primary">{opponent.wins}</p>
          <p className="text-[10px] text-text-secondary font-sans">Wins</p>
        </div>
        <div>
          <p className="font-display font-bold text-base text-error">{opponent.losses}</p>
          <p className="text-[10px] text-text-secondary font-sans">Losses</p>
        </div>
        <div>
          <p className="font-display font-bold text-base text-secondary">{opponent.winRate}%</p>
          <p className="text-[10px] text-text-secondary font-sans">Win Rate</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: winBarWidth }}
            transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.3 }}
          />
        </div>
        <p className="text-[10px] text-text-secondary font-sans text-right">
          {total} games played
        </p>
      </div>
    </motion.div>
  );
}
