"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { LeaderboardRow, type LeaderboardEntry } from "./LeaderboardRow";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const itemReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
};

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  startFrom?: number; // skip podium top 3, start at index 3
}

export function LeaderboardList({ entries, startFrom = 3 }: LeaderboardListProps) {
  const reduced = useReducedMotion();
  const listEntries = entries.slice(startFrom);

  return (
    <>
      {listEntries.length > 0 && (
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[9px] font-mono text-text-secondary/30 uppercase tracking-widest">
            Rank · Player · W/L/WR
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-mono text-text-secondary/30 uppercase tracking-widest">Celo</span>
          </span>
        </div>
      )}
    <motion.div
      key={entries.length} // re-animate on tab switch
      className="space-y-2"
      variants={container}
      initial="hidden"
      animate="show"
      role="list"
    >
      {listEntries.map((entry) => (
        <motion.div
          key={entry.address}
          variants={reduced ? itemReduced : item}
          role="listitem"
        >
          <LeaderboardRow entry={entry} />
        </motion.div>
      ))}
    </motion.div>
    </>
  );
}
