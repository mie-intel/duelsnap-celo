"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MatchmakingState } from "../../hooks/useMatchmaking";

interface MatchmakingModalProps {
  mm: MatchmakingState;
  children: React.ReactNode;
}

export function MatchmakingModal({ mm, children }: MatchmakingModalProps) {
  const isOpen = mm.state !== "idle";

  return (
    <>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[var(--z-modal)] flex items-end lg:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-bg-overlay backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={
                mm.state === "searching" || mm.state === "connection_lost"
                  ? undefined
                  : mm.cancel
              }
            />

            {/* Sheet */}
            <motion.div
              className="relative z-10 w-full max-w-md mx-4 mb-6 lg:mb-0 rounded-[2rem] border border-border-mid bg-bg-card overflow-hidden"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                boxShadow:
                  "0 0 0 1px rgba(53,208,127,0.1), 0 24px 48px rgba(0,0,0,0.6)",
              }}
            >
              {/* Ambient glow top */}
              <div
                className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(53,208,127,0.08) 0%, transparent 70%)",
                }}
              />

              {/* Content slot — filled by state-specific children */}
              <div className="relative z-10 p-6">
                <AnimatePresence mode="wait">
                  {/* State content injected by parent */}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
