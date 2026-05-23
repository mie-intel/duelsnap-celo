'use client';

import { motion } from 'framer-motion';
import { CATEGORIES } from './types';
import type { Category } from './types';

interface CategoryGridProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

function CheckBadge() {
  return (
    <span
      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
        <path d="M2 6l3 3 5-5" stroke="#0F001F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CategoryCard({
  category,
  isSelected,
  onSelect,
}: {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="relative w-full text-left rounded-2xl p-4 flex flex-col gap-2 transition-all focus-visible:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: category.colorLight,
        border: isSelected
          ? `2px solid ${category.color}`
          : '1px solid var(--color-border-subtle)',
        boxShadow: isSelected
          ? `0 0 16px ${category.color}28`
          : 'none',
      }}
      aria-pressed={isSelected}
    >
      {isSelected && <CheckBadge />}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={category.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d={category.icon} />
      </svg>
      <span className="font-display font-bold text-sm text-text-primary leading-tight">
        {category.label}
      </span>
      <span className="text-xs text-text-secondary leading-snug">{category.description}</span>
    </motion.button>
  );
}

export function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {CATEGORIES.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          isSelected={selected === cat.id}
          onSelect={() => onSelect(cat.id)}
        />
      ))}
    </motion.div>
  );
}
