"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface WinRateDonutProps {
  wins: number;
  total: number;
}

const RADIUS = 40;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = 50;

export default function WinRateDonut({ wins, total }: WinRateDonutProps) {
  const winRate = total > 0 ? wins / total : 0;
  const winRatePct = Math.round(winRate * 100);

  const progress = useMotionValue(0);
  const strokeDashoffset = useTransform(
    progress,
    (v) => CIRCUMFERENCE * (1 - v),
  );

  const displayPct = useMotionValue(0);
  const roundedPct = useTransform(displayPct, (v) => `${Math.round(v)}%`);

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    animate(progress, winRate, { duration: 1.2, ease: "easeOut" });
    animate(displayPct, winRatePct, { duration: 1.2, ease: "easeOut" });
  }, [winRate, winRatePct, progress, displayPct]);

  return (
    <div className="bg-[var(--color-bg-card)] rounded-[2rem] border border-[var(--color-border-subtle)] p-5 mb-5 flex flex-col items-center">
      <h3 className="font-display font-semibold text-sm text-[var(--color-text-secondary)] uppercase tracking-widest mb-4 self-start">
        Win Rate
      </h3>

      <div className="relative w-28 h-28">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="rgba(248,243,235,0.08)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress arc */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center rotate-0">
          <motion.span className="font-display font-bold text-xl text-[var(--color-text-primary)]">
            {roundedPct}
          </motion.span>
        </div>
      </div>

      <p className="text-[var(--color-text-secondary)] text-xs font-sans mt-3">
        {total > 0 ? `${wins} wins from ${total} games` : "No games yet"}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[9px] font-mono text-[var(--color-text-secondary)]/40 uppercase tracking-widest">
          On Celo
        </span>
      </div>
    </div>
  );
}
