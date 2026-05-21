"use client";

import { motion } from "framer-motion";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const isActive = i + 1 === currentStep;
          const isDone = i + 1 < currentStep;
          return (
            <motion.div
              key={i}
              layout
              className={[
                "h-2 rounded-full transition-colors duration-300",
                isActive || isDone
                  ? "bg-primary"
                  : "bg-border-mid",
              ].join(" ")}
              animate={{ width: isActive ? 32 : 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          );
        })}
      </div>
      <span className="text-xs font-mono text-text-secondary whitespace-nowrap">
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}
