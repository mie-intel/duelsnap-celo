'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Difficulty } from './types';
import { DIFFICULTY_LABELS } from './types';

interface DifficultySelectorProps {
  selected: Difficulty;
  onChange: (d: Difficulty) => void;
}

const pills: { id: Difficulty; label: string; celoFee: string; activeStyle: React.CSSProperties }[] = [
  {
    id: 'easy',
    label: 'Easy',
    celoFee: 'Free',
    activeStyle: {
      backgroundColor: 'rgba(53,208,127,0.15)',
      color: 'var(--color-primary)',
      border: '1px solid rgba(53,208,127,0.4)',
    },
  },
  {
    id: 'medium',
    label: 'Medium',
    celoFee: '0.005 CELO',
    activeStyle: {
      backgroundColor: 'rgba(251,204,92,0.15)',
      color: 'var(--color-secondary)',
      border: '1px solid rgba(251,204,92,0.4)',
    },
  },
  {
    id: 'hard',
    label: 'Hard',
    celoFee: '0.01 CELO',
    activeStyle: {
      backgroundColor: 'rgba(255,77,77,0.15)',
      color: 'var(--color-error)',
      border: '1px solid rgba(255,77,77,0.4)',
    },
  },
];

const inactiveStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface-1)',
  color: 'var(--color-text-secondary)',
  border: '1px solid var(--color-border-subtle)',
};

export function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-display font-bold uppercase tracking-widest text-text-secondary">
        Difficulty
      </span>
      <div className="flex gap-2">
        {pills.map((pill) => (
          <motion.button
            key={pill.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(pill.id)}
            className="flex-1 flex flex-col items-center py-2 px-3 rounded-xl text-sm font-semibold font-sans transition-all"
            style={selected === pill.id ? pill.activeStyle : inactiveStyle}
            aria-pressed={selected === pill.id}
          >
            <span>{pill.label}</span>
            <span className="text-[9px] font-mono font-normal mt-0.5 opacity-70">{pill.celoFee}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={selected}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="text-xs text-text-secondary font-sans"
        >
          {DIFFICULTY_LABELS[selected]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
