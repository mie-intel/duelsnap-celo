"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const ShimmerRow = memo(function ShimmerRow({ index }: { index: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border-subtle bg-surface-1 overflow-hidden relative"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.05 }}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
      />

      {/* Rank */}
      <div className="w-8 h-4 rounded-full bg-surface-2 shrink-0" />
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-surface-2 shrink-0" />
      {/* Text lines */}
      <div className="flex-1 space-y-1.5">
        <div
          className="h-3 bg-surface-2 rounded-full"
          style={{ width: `${55 + (index % 3) * 15}%` }}
        />
        <div className="h-2.5 bg-surface-2 rounded-full w-1/3" />
      </div>
      {/* CELO */}
      <div className="w-14 h-4 rounded-full bg-surface-2 shrink-0" />
    </motion.div>
  );
});

export function LeaderboardSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-label="Loading leaderboard" aria-busy="true">
      {/* Podium skeleton */}
      <div className="rounded-[2rem] border border-border-subtle bg-surface-1 p-6 mb-4 h-52 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        <div className="h-full flex items-end justify-center gap-4 pb-4">
          <div className="w-1/4 h-3/5 rounded-t-xl bg-surface-2" />
          <div className="w-1/4 h-full rounded-t-xl bg-surface-2" />
          <div className="w-1/4 h-2/5 rounded-t-xl bg-surface-2" />
        </div>
      </div>

      {/* Row skeletons */}
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton index is stable
        <ShimmerRow key={i} index={i} />
      ))}
    </div>
  );
}
