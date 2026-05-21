"use client";

import { motion } from "framer-motion";
import type { GameLogEntry } from "../../hooks/usePlayerLog";

interface CategoryBreakdownProps {
  entries: GameLogEntry[];
}

const MODE_LABELS: Record<string, string> = {
  free: "Free",
  casual: "Paid Casual",
  competitive: "PvP Ranked",
};

const MODE_COLORS: Record<string, string> = {
  free: "var(--color-primary)",
  casual: "var(--color-secondary)",
  competitive: "var(--color-error)",
};

export default function CategoryBreakdown({ entries }: CategoryBreakdownProps) {
  const modes = ["free", "casual", "competitive"] as const;

  const stats = modes.map((mode) => {
    const modeEntries = entries.filter((e) => e.mode === mode);
    const wins = modeEntries.filter((e) => e.result === "win").length;
    const losses = modeEntries.filter((e) => e.result === "lose").length;
    const total = modeEntries.length;
    const winPct = total > 0 ? (wins / total) * 100 : 0;
    return { mode, wins, losses, total, winPct };
  });

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] mb-3">
        Performance by Mode
      </p>
      {entries.length === 0 ? (
        <p className="text-[var(--color-text-secondary)] text-sm font-sans">
          Play some games to see your stats
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {stats.map(({ mode, wins, losses, total, winPct }) => (
            <div key={mode}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-sans text-[var(--color-text-primary)]">
                  {MODE_LABELS[mode]}
                </span>
                <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                  {wins}W {losses}L
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[rgba(248,243,235,0.08)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: MODE_COLORS[mode] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${winPct}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              {total === 0 && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-sans">
                  No {MODE_LABELS[mode].toLowerCase()} games yet
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
