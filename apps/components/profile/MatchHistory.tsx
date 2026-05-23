"use client";

import { motion } from "framer-motion";
import type { GameLogEntry, GameMode, GameResult } from "../../hooks/usePlayerLog";

interface MatchHistoryFilters {
  result?: "win" | "lose" | "all";
  mode?: string;
  dateRange?: "week" | "month" | "all";
}

interface MatchHistoryProps {
  entries: GameLogEntry[];
  filters: MatchHistoryFilters;
}

const MODE_PILL: Record<GameMode, { label: string; color: string }> = {
  free: { label: "FREE", color: "rgba(248,243,235,0.12)" },
  casual: { label: "CASUAL", color: "rgba(53,208,127,0.15)" },
  competitive: { label: "PVP", color: "rgba(251,204,92,0.15)" },
};

const MODE_TEXT: Record<GameMode, string> = {
  free: "rgba(248,243,235,0.6)",
  casual: "var(--color-primary)",
  competitive: "var(--color-secondary)",
};

const RESULT_STYLE: Record<GameResult, { label: string; color: string }> = {
  win: { label: "Win", color: "var(--color-primary)" },
  lose: { label: "Loss", color: "var(--color-error)" },
  tie: { label: "Tie", color: "var(--color-secondary)" },
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatAmount(amount: number): string {
  if (amount === 0) return "";
  const celo = amount / 1e18;
  const sign = celo > 0 ? "+" : "";
  return `${sign}${celo.toFixed(4)} CELO`;
}

export default function MatchHistory({ entries, filters }: MatchHistoryProps) {
  let filtered = [...entries];

  // Result filter
  if (filters.result && filters.result !== "all") {
    filtered = filtered.filter((e) => e.result === filters.result);
  }

  // Mode filter
  if (filters.mode && filters.mode !== "all") {
    filtered = filtered.filter((e) => e.mode === filters.mode);
  }

  // Date range filter
  if (filters.dateRange === "week") {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((e) => e.timestamp >= cutoff);
  } else if (filters.dateRange === "month") {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((e) => e.timestamp >= cutoff);
  }

  // Sort most recent first, cap at 50
  filtered = filtered.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);

  return (
    <div className="bg-[var(--color-bg-card)] rounded-[2rem] border border-[var(--color-border-subtle)] overflow-hidden mb-5">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-display font-semibold text-sm text-[var(--color-text-secondary)] uppercase tracking-widest">
          Match History
        </h3>
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 pb-5 text-center">
          <p className="text-[var(--color-text-secondary)] text-sm font-sans py-6">
            No matches found
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {filtered.map((entry, i) => {
            const resultStyle = RESULT_STYLE[entry.result];
            const modeStyle = MODE_PILL[entry.mode];
            const amountStr = formatAmount(entry.amount);
            const isPositive = entry.amount > 0;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex items-center gap-3 px-5 py-3"
              >
                {/* Mode badge */}
                <span
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg shrink-0"
                  style={{
                    backgroundColor: modeStyle.color,
                    color: MODE_TEXT[entry.mode],
                  }}
                >
                  {modeStyle.label}
                </span>

                {/* Result + date */}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-sm font-sans font-medium"
                    style={{ color: resultStyle.color }}
                  >
                    {resultStyle.label}
                  </span>
                  <span className="text-[var(--color-text-secondary)] text-xs font-sans ml-2">
                    {relativeTime(entry.timestamp)}
                  </span>
                </div>

                {/* Amount */}
                {amountStr && (
                  <span
                    className="text-xs font-mono shrink-0"
                    style={{
                      color: isPositive ? "var(--color-primary)" : "var(--color-error)",
                    }}
                  >
                    {amountStr}
                  </span>
                )}

                {/* Blockscout tx link if available */}
                {entry.txHash && (
                  <a
                    href={`https://celo.blockscout.com/tx/${entry.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-mono text-text-secondary/40 hover:text-primary transition-colors shrink-0"
                    title="View on Blockscout"
                  >
                    {(entry.txHash as string).slice(0, 6)}…
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
