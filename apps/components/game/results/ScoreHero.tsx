"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreHeroProps {
  correct: number;
  total: number;
}

function getVerdict(pct: number): { label: string; color: string; glowColor: string } {
  if (pct >= 90) return { label: 'Flawless', color: 'text-primary', glowColor: 'rgba(53,208,127,0.22)' };
  if (pct >= 70) return { label: 'Excellent', color: 'text-secondary', glowColor: 'rgba(251,204,92,0.22)' };
  if (pct >= 50) return { label: 'Good', color: 'text-warning', glowColor: 'rgba(251,204,92,0.14)' };
  return { label: 'Keep Practicing', color: 'text-error', glowColor: 'rgba(255,77,77,0.18)' };
}

export default function ScoreHero({ correct, total }: ScoreHeroProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const { label, color, glowColor } = getVerdict(pct);

  // Count-up for correct score
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (correct === 0) return;
    let start = 0;
    const duration = 900; // ms
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * correct);
      setDisplayCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [correct]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="relative flex flex-col items-center justify-center text-center px-6 py-8 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] overflow-hidden"
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Score */}
      <p className="relative font-display font-bold text-[4.5rem] leading-none text-[var(--color-text-primary)] tabular-nums">
        <span className="text-primary">{displayCount}</span>
        <span className="text-[var(--color-text-secondary)] text-4xl">/{total}</span>
      </p>

      {/* Percentage */}
      <p className="relative font-mono text-sm text-[var(--color-text-secondary)] mt-1 tabular-nums">
        {pct}% accuracy
      </p>

      {/* Verdict */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className={`relative font-display font-semibold text-xl mt-3 ${color}`}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}
