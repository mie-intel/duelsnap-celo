"use client";

import { motion } from "framer-motion";
import type { LeaderboardEntry } from "./LeaderboardRow";

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatCelo(wei: number): string {
  const celo = wei / 1e18;
  return celo >= 1 ? celo.toFixed(2) : celo.toFixed(4);
}

interface PlayerHighlightRowProps {
  entry: LeaderboardEntry | null;
  totalEntries: number;
}

export function PlayerHighlightRow({ entry, totalEntries }: PlayerHighlightRowProps) {
  if (!entry) return null;

  const isUnranked = entry.rank > totalEntries;

  return (
    <motion.div
      className="fixed bottom-[4.5rem] lg:bottom-4 left-0 right-0 z-[var(--z-sticky-nav)] px-4 lg:px-8 pointer-events-none"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-primary/50 bg-bg-page/90 backdrop-blur-xl shadow-[0_0_24px_rgba(53,208,127,0.2)] pointer-events-auto">
          {/* Your rank */}
          <div className="w-8 shrink-0 text-center">
            <span className="font-display font-bold text-sm text-primary">
              #{isUnranked ? "—" : entry.rank}
            </span>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold font-display bg-primary/20 text-primary">
            {entry.address.slice(2, 4).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-medium text-primary truncate">
              {truncateAddress(entry.address)}
              <span className="ml-2 text-[10px] font-sans font-bold uppercase tracking-widest text-primary/60">
                you
              </span>
            </p>
            <p className="text-text-secondary text-[10px] font-sans">
              {isUnranked ? "Not yet ranked" : `Your position`}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="font-display font-bold text-sm text-secondary">
              {formatCelo(entry.totalCelo)}
            </p>
            <p className="text-text-secondary text-[10px] font-sans">CELO</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
