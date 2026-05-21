"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOnboarding } from "./OnboardingContext";
import OnboardingWizard from "./OnboardingWizard";

export default function OnboardingModal() {
  const { isOpen } = useOnboarding();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="onboarding-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="onboarding-modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-[var(--color-bg-card)] rounded-[2rem] border border-[var(--color-border-subtle)] w-full max-w-sm p-6 pointer-events-auto"
              style={{ boxShadow: "0 32px 96px rgba(0,0,0,0.7)" }}
            >
              {/* Logo mark */}
              <div className="flex items-center justify-center mb-6">
                <div
                  className="w-10 h-10 rounded-[0.75rem] flex items-center justify-center font-display font-black text-lg"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), #FBCC5C)",
                    color: "#0F001F",
                  }}
                >
                  D
                </div>
              </div>

              <OnboardingWizard />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
