"use client";

import { motion } from 'framer-motion';

interface RematchCTAProps {
  onRematch?: () => void;
  onPlayAgain?: () => void;
  onHome: () => void;
  mode: string;
}

export default function RematchCTA({ onRematch, onPlayAgain, onHome }: RematchCTAProps) {
  return (
    <div className="flex flex-col gap-3">
      {onRematch ? (
        <>
          <motion.button
            onClick={onRematch}
            animate={{ boxShadow: ['0 0 0px var(--color-primary)', '0 0 16px var(--color-primary)', '0 0 0px var(--color-primary)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-semibold text-base bg-primary text-text-inverse transition-all duration-150 active:scale-95 hover:bg-primary-dark"
          >
            Rematch
          </motion.button>
          <button onClick={onPlayAgain} className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-semibold text-base border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-150 active:scale-95">
            New Game
          </button>
          <button onClick={onHome} className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-medium text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-150 active:scale-95">
            Home
          </button>
        </>
      ) : (
        <>
          {onPlayAgain && (
            <button onClick={onPlayAgain} className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-semibold text-base bg-primary text-text-inverse hover:bg-primary-dark transition-all duration-150 active:scale-95">
              Play Again
            </button>
          )}
          <button onClick={onHome} className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-medium text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-150 active:scale-95">
            Home
          </button>
        </>
      )}
      <p className="text-center text-[10px] font-mono text-[var(--color-text-secondary)]/40 uppercase tracking-widest mt-1">
        Settlement on Celo Mainnet
      </p>
    </div>
  );
}
