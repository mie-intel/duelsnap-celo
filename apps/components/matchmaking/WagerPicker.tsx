"use client";

import { motion } from "framer-motion";

const WAGER_OPTIONS = [
  { value: 0.1, label: "0.1", sublabel: "Starter" },
  { value: 0.5, label: "0.5", sublabel: "Standard" },
  { value: 1.0, label: "1.0", sublabel: "High Stakes" },
];

interface WagerPickerProps {
  selected: number;
  onChange: (value: number) => void;
}

export function WagerPicker({ selected, onChange }: WagerPickerProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-text-secondary/60 mb-3">
        Wager Amount
      </p>
      <div className="grid grid-cols-3 gap-2">
        {WAGER_OPTIONS.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              whileTap={{ scale: 0.96, y: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`flex flex-col items-center py-3 px-2 rounded-2xl border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                isActive
                  ? "bg-secondary/10 border-secondary/50 shadow-[0_0_12px_rgba(251,204,92,0.15)]"
                  : "bg-surface-1 border-border-subtle hover:border-border-mid hover:bg-surface-2"
              }`}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="wager-active"
                  className="absolute inset-0 rounded-2xl bg-secondary/8"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`font-display font-bold text-lg relative z-10 ${
                  isActive ? "text-secondary" : "text-text-primary"
                }`}
              >
                {opt.label}
              </span>
              <span
                className={`font-sans text-[10px] relative z-10 ${
                  isActive ? "text-secondary/70" : "text-text-secondary"
                }`}
              >
                CELO
              </span>
              <span
                className={`font-sans text-[10px] relative z-10 mt-0.5 ${
                  isActive ? "text-secondary/60" : "text-text-secondary/60"
                }`}
              >
                {opt.sublabel}
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-text-secondary text-[11px] font-sans mt-2 text-center">
        Winner takes 87% · Creator pool 10% · Protocol 3%
      </p>
    </div>
  );
}
