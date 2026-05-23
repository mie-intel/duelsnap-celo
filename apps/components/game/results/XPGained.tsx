"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface XPGainedProps {
  correct: number;
  total: number;
  mode: 'free' | 'paid';
}

const MAX_XP = 150;

function calcXP(correct: number, mode: 'free' | 'paid'): number {
  return correct * 10 + (mode === 'paid' ? 20 : 0);
}

export default function XPGained({ correct, total, mode }: XPGainedProps) {
  const xp = calcXP(correct, mode);
  const barPct = Math.min((xp / MAX_XP) * 100, 100);
  const [displayXP, setDisplayXP] = useState(0);

  useEffect(() => {
    if (xp === 0) return;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayXP(Math.round(eased * xp));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [xp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="flex flex-col gap-3 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] px-6 py-5"
    >
      <div>
        <p className="font-mono text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">This Session</p>
        <h3 className="font-display font-semibold text-base text-[var(--color-text-primary)]">Experience Gained</h3>
      </div>
      <p className="font-mono font-bold text-4xl text-secondary tabular-nums">
        +{displayXP} <span className="text-xl font-semibold">XP</span>
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="relative h-2 rounded-full bg-[var(--color-surface-1)] overflow-hidden">
          <div className="absolute inset-y-0 left-0 rounded-full bg-secondary animate-bar-fill" style={{ width: `${barPct}%` }} />
        </div>
        <p className="font-sans text-xs text-[var(--color-text-secondary)]">{xp} / {MAX_XP} XP</p>
      </div>
      <div className="flex flex-col gap-1 font-sans text-xs text-[var(--color-text-secondary)]">
        <span>{correct} correct × 10 XP = <span className="text-[var(--color-text-primary)]">{correct * 10} XP</span></span>
        {mode === 'paid' && <span className="text-secondary font-medium">+20 bonus for paid mode</span>}
        <span>{total - correct} missed × 0 XP</span>
      </div>
      <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--color-border-subtle)]">
        <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
        <span className="text-[9px] font-mono text-[var(--color-text-secondary)]/50 uppercase tracking-widest">
          On Celo · Carbon-neutral game
        </span>
      </div>
    </motion.div>
  );
}
