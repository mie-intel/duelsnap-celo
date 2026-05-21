'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CATEGORIES } from './types';
import type { Difficulty } from './types';
import { CategoryGrid } from './CategoryGrid';
import { DifficultySelector } from './DifficultySelector';
import { SelectionIndicator } from './SelectionIndicator';
import Button from '../ui/Button';

interface CategoryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: string, difficulty: Difficulty) => void;
  mode: 'free' | 'paid';
}

export function CategoryPickerModal({
  isOpen,
  onClose,
  onConfirm,
  mode,
}: CategoryPickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory(null);
      setDifficulty('medium');
    }
  }, [isOpen]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory) ?? null;

  function handleConfirm() {
    if (!selectedCategory) return;
    onConfirm(selectedCategory, difficulty);
    onClose();
  }

  function handleAnyCategory() {
    const randomId = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id;
    onConfirm(randomId, difficulty);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-bg-card rounded-[2rem] border border-border-subtle max-w-md w-full p-6 pointer-events-auto flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-bold text-xl text-text-primary">
                    Choose Category
                  </h2>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={
                      mode === 'free'
                        ? {
                            backgroundColor: 'rgba(53,208,127,0.15)',
                            color: 'var(--color-primary)',
                          }
                        : {
                            backgroundColor: 'rgba(251,204,92,0.15)',
                            color: 'var(--color-secondary)',
                          }
                    }
                  >
                    {mode === 'free' ? 'FREE' : '0.01 CELO'}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <CategoryGrid selected={selectedCategory} onSelect={setSelectedCategory} />
              <DifficultySelector selected={difficulty} onChange={setDifficulty} />
              <SelectionIndicator category={activeCategory} />

              {/* Footer */}
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedCategory}
                  size="md"
                  className="w-full"
                >
                  Start Game
                </Button>
                <Button onClick={handleAnyCategory} variant="ghost" size="sm" className="w-full">
                  Any Category
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
