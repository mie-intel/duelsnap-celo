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
          {/* Rematch — pulsing border animation */}
          <motion.button
            onClick={onRematch}
            animate={{
              boxShadow: [
                '0 0 0px var(--color-primary)',
                '0 0 16px var(--color-primary)',
                '0 0 0px var(--color-primary)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-semibold text-base bg-primary text-text-inverse transition-all duration-150 active:scale-95 hover:bg-primary-dark"
          >
            Rematch
          </motion.button>

          {/* New Game — secondary */}
          <button
            onClick={onPlayAgain}
            className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-semibold text-base border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-150 active:scale-95"
          >
            New Game
          </button>

          {/* Home — ghost */}
          <button
            onClick={onHome}
            className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-medium text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-150 active:scale-95"
          >
            Home
          </button>
        </>
      ) : (
        <>
          {/* Play Again — primary */}
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-semibold text-base bg-primary text-text-inverse hover:bg-primary-dark transition-all duration-150 active:scale-95"
            >
              Play Again
            </button>
          )}

          {/* Home — ghost */}
          <button
            onClick={onHome}
            className="w-full min-h-[48px] px-8 py-3 rounded-full font-sans font-medium text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-150 active:scale-95"
          >
            Home
          </button>
        </>
      )}
    </div>
  );
}
