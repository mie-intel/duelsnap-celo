"use client";

import { motion } from "framer-motion";
import type { Achievement } from "./achievements";

interface AchievementBadgesProps {
  achievements: Achievement[];
  unlockedIds: string[];
}

const rarityColors: Record<string, { border: string; bg: string; dot: string }> = {
  common:    { border: "border-primary/30",   bg: "bg-primary/10",   dot: "bg-primary" },
  rare:      { border: "border-secondary/40", bg: "bg-secondary/10", dot: "bg-secondary" },
  epic:      { border: "border-purple-400/40",bg: "bg-purple-500/10",dot: "bg-purple-400" },
  legendary: { border: "border-error/40",     bg: "bg-error/10",     dot: "bg-error" },
};

export default function AchievementBadges({ achievements, unlockedIds }: AchievementBadgesProps) {
  const unlocked = achievements.filter((a) => unlockedIds.includes(a.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
          Achievements
        </p>
        <span className="text-xs font-mono text-[var(--color-text-secondary)]">
          {unlocked.length}/{achievements.length}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {achievements.map((badge, i) => {
          const isUnlocked = unlockedIds.includes(badge.id);
          const colors = rarityColors[badge.rarity] ?? rarityColors.common;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
              title={`${badge.label} — ${badge.description}`}
              className={[
                "flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-colors",
                isUnlocked
                  ? `${colors.bg} ${colors.border}`
                  : "bg-[rgba(255,255,255,0.03)] border-[var(--color-border-subtle)]",
              ].join(" ")}
            >
              {/* Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={[
                  "w-8 h-8",
                  isUnlocked ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] opacity-30",
                ].join(" ")}
              >
                <path d={badge.icon} />
              </svg>
              {/* Label */}
              <p
                className={[
                  "text-[10px] font-sans text-center leading-tight",
                  isUnlocked ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] opacity-40",
                ].join(" ")}
              >
                {badge.label}
              </p>
              {/* Rarity dot */}
              {isUnlocked && (
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
