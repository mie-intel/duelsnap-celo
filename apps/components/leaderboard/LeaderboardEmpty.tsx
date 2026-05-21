"use client";

import { motion } from "framer-motion";

interface LeaderboardEmptyProps {
  tab: "global" | "weekly";
}

export function LeaderboardEmpty({ tab }: LeaderboardEmptyProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Trophy outline */}
      <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-primary/50"
          aria-hidden="true"
        >
          <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
          <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
          <path d="M6 3h12v8a6 6 0 0 1-12 0V3Z" />
          <path d="M9 21h6" />
          <path d="M12 17v4" />
        </svg>
      </div>

      <div className="max-w-[200px]">
        <p className="font-display font-bold text-text-primary text-base mb-1">
          {tab === "weekly" ? "No games this week" : "No games yet"}
        </p>
        <p className="text-text-secondary text-sm font-sans leading-relaxed">
          {tab === "weekly"
            ? "Play a duel to appear on the weekly rankings."
            : "Be the first to earn CELO and claim the top spot."}
        </p>
      </div>
    </motion.div>
  );
}

interface LeaderboardErrorProps {
  message: string;
  onRetry: () => void;
}

export function LeaderboardError({ message, onRetry }: LeaderboardErrorProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="rounded-2xl border border-error/30 bg-error/10 px-5 py-4 max-w-xs w-full">
        <p className="text-error text-sm font-sans font-medium mb-3">
          {message || "Failed to load leaderboard"}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-semibold font-sans text-primary hover:text-primary-dark transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Try again
        </button>
      </div>
    </motion.div>
  );
}
