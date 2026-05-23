"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Achievement } from "./achievements";

interface BadgeUnlockFlashProps {
  badge: Achievement | null;
  onDone: () => void;
}

const RARITY_COLOR: Record<Achievement["rarity"], string> = {
  common: "var(--color-primary)",
  rare: "var(--color-secondary)",
  epic: "#a78bfa",
  legendary: "var(--color-error)",
};

const RARITY_LABEL: Record<Achievement["rarity"], string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

// 8 confetti dots with deterministic offsets
const CONFETTI = [
  { x: -120, y: -80, color: "var(--color-primary)" },
  { x: 120, y: -80, color: "var(--color-secondary)" },
  { x: -140, y: 40, color: "#a78bfa" },
  { x: 140, y: 40, color: "var(--color-primary)" },
  { x: -60, y: 140, color: "var(--color-secondary)" },
  { x: 60, y: 140, color: "var(--color-error)" },
  { x: -100, y: -140, color: "var(--color-error)" },
  { x: 100, y: -140, color: "#a78bfa" },
];

export default function BadgeUnlockFlash({ badge, onDone }: BadgeUnlockFlashProps) {
  useEffect(() => {
    if (!badge) return;
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [badge, onDone]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[65] flex items-center justify-center"
          style={{ backgroundColor: "rgba(15,0,31,0.85)", backdropFilter: "blur(8px)" }}
          onClick={onDone}
        >
          {/* Confetti dots */}
          {CONFETTI.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: dot.color }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: dot.x, y: dot.y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
            />
          ))}

          {/* Badge card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="relative flex flex-col items-center gap-4 rounded-[2rem] border p-8 text-center max-w-xs w-full mx-4"
            style={{
              backgroundColor: "var(--color-bg-card)",
              borderColor: RARITY_COLOR[badge.rarity],
              boxShadow: `0 0 60px ${RARITY_COLOR[badge.rarity]}40`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rarity label */}
            <span
              className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{
                color: RARITY_COLOR[badge.rarity],
                borderColor: RARITY_COLOR[badge.rarity],
              }}
            >
              {RARITY_LABEL[badge.rarity]}
            </span>

            {/* Achievement icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${RARITY_COLOR[badge.rarity]}15` }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke={RARITY_COLOR[badge.rarity]}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={badge.icon} />
              </svg>
            </div>

            {/* Achievement unlocked label */}
            <div>
              <p
                className="text-[10px] font-sans uppercase tracking-widest mb-1"
                style={{ color: RARITY_COLOR[badge.rarity] }}
              >
                Achievement Unlocked
              </p>
              <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
                {badge.label}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm font-sans mt-1">
                {badge.description}
              </p>
            </div>

            {/* Celo on-chain label */}
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-mono text-[var(--color-text-secondary)]/50 uppercase tracking-widest">
                Earned on Celo Mainnet
              </span>
            </div>
            {/* Dismiss hint */}
            <p className="text-[var(--color-text-secondary)] text-[10px] font-sans">
              Tap anywhere to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
