"use client";

import { motion } from 'framer-motion';

interface RewardBreakdownProps {
  mode: 'free' | 'paid';
  wagerAmount?: number;
  txHash?: string;
}

interface BarRowProps {
  label: string;
  percentage: number;
  color: 'primary' | 'secondary';
  delay?: number;
}

function BarRow({ label, percentage, color, delay = 0 }: BarRowProps) {
  const barColor = color === 'primary' ? 'bg-primary' : 'bg-secondary';
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="font-sans text-sm text-[var(--color-text-primary)]">{label}</span>
        <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">{percentage}%</span>
      </div>
      <div className="relative h-2 rounded-full bg-[var(--color-surface-1)] overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${barColor} animate-bar-fill`}
          style={{ width: `${percentage}%`, animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

export default function RewardBreakdown({ mode, wagerAmount, txHash }: RewardBreakdownProps) {
  if (mode !== 'paid' && (!wagerAmount || wagerAmount <= 0)) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="flex flex-col gap-4 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] px-6 py-5"
    >
      <div>
        <p className="font-mono text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Fee Distribution</p>
        <h3 className="font-display font-semibold text-base text-[var(--color-text-primary)]">Reward Breakdown</h3>
      </div>
      <div className="flex flex-col gap-4">
        <BarRow label="Contributors" percentage={90} color="primary" delay={0} />
        <BarRow label="Treasury" percentage={10} color="secondary" delay={150} />
      </div>
      {wagerAmount && wagerAmount > 0 && (
        <p className="font-sans text-xs text-[var(--color-text-secondary)]">
          Wager: <span className="text-[var(--color-text-primary)] font-medium">{wagerAmount.toFixed(4)} CELO</span>
        </p>
      )}
      {txHash && (
        <a href={`https://celo.blockscout.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-sans text-xs text-primary hover:text-primary-dark underline underline-offset-2 transition-colors w-fit">
          View on Blockscout
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 10L10 2M5 2h5v5" /></svg>
        </a>
      )}
      <p className="font-sans text-xs text-[var(--color-text-secondary)]">Royalties distributed automatically on-chain.</p>
    </motion.div>
  );
}
