"use client";

import { motion } from "framer-motion";

interface MatchmakingTimeoutProps {
  onRetry: () => void;
  onCancel: () => void;
}

export function MatchmakingTimeout({ onRetry, onCancel }: MatchmakingTimeoutProps) {
  return (
    <motion.div
      key="timeout"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="flex flex-col items-center gap-6 py-4 text-center"
    >
      <div className="w-16 h-16 rounded-[1.5rem] bg-error/10 border border-error/30 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="w-8 h-8 text-error/70"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="space-y-1.5 max-w-[240px]">
        <h2 className="font-display font-bold text-xl text-text-primary">
          The arena is quiet… 👻
        </h2>
        <p className="text-text-secondary text-sm font-sans leading-relaxed">
          No challengers stepped up. Either they're scared or the timing is off — try again!
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <motion.button
          type="button"
          onClick={onRetry}
          whileTap={{ scale: 0.98, y: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-full py-3.5 rounded-2xl bg-primary text-text-inverse font-display font-bold text-sm min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Try Again
        </motion.button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 text-sm font-semibold font-sans text-text-secondary hover:text-text-primary transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
