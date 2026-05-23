"use client";

import { motion } from 'framer-motion';
import type { QuestionResult } from '../GameEngine';

interface QuestionBreakdownProps {
  results: QuestionResult[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4 10 8 14 16 6" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
      <line x1="5" y1="5" x2="15" y2="15" />
      <line x1="15" y1="5" x2="5" y2="15" />
    </svg>
  );
}

export default function QuestionBreakdown({ results }: QuestionBreakdownProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Per Question</p>
          <h2 className="font-display font-semibold text-lg text-[var(--color-text-primary)]">Question Breakdown</h2>
        </div>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 mt-0.5">
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Celo</span>
        </span>
      </div>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {results.map((r, i) => (
          <motion.div
            key={r.id}
            variants={rowVariants}
            className={[
              'flex items-center gap-3 rounded-2xl p-3',
              'bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]',
              r.correct ? 'border-l-2 border-l-primary/50' : 'border-l-2 border-l-error/50',
            ].join(' ')}
          >
            <span className="text-[var(--color-text-secondary)] text-xs font-mono w-4 shrink-0 text-right">{i + 1}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.imageUrl} alt="" width={40} height={40} className="w-10 h-10 rounded-xl object-cover shrink-0" />
            <p className="flex-1 font-sans text-sm text-[var(--color-text-primary)] uppercase truncate min-w-0">{r.guess || '—'}</p>
            {r.correct ? <CheckIcon className="w-5 h-5 text-primary shrink-0" /> : <XIcon className="w-5 h-5 text-error shrink-0" />}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
