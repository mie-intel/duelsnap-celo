'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Category } from './types';

interface SelectionIndicatorProps {
  category: Category | null;
}

export function SelectionIndicator({ category }: SelectionIndicatorProps) {
  return (
    <AnimatePresence>
      {category && (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            backgroundColor: category.colorLight,
            border: `1px solid ${category.color}`,
          }}
        >
          {/* Glow orb */}
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              backgroundColor: category.color,
              boxShadow: `0 0 8px 2px ${category.colorLight}`,
            }}
          />
          <span className="font-display font-bold text-sm text-text-primary">
            {category.label}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: category.color, color: 'var(--color-bg-page)' }}
            >
              Selected
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
