"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMatchmaking } from "../../hooks/useMatchmaking";
import { MatchmakingIdle } from "./MatchmakingIdle";
import { MatchmakingSearching } from "./MatchmakingSearching";
import { MatchmakingFound } from "./MatchmakingFound";
import { MatchmakingCountdown } from "./MatchmakingCountdown";
import { MatchmakingTimeout } from "./MatchmakingTimeout";

export function MatchmakingWidget() {
  const mm = useMatchmaking();
  const isOpen = mm.state !== "idle";

  return (
    <>
      {/* Trigger — rendered by play page */}
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
              {/* Ambient glow */}
              <div
                className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(53,208,127,0.08) 0%, transparent 70%)",
                }}
              />

              {/* Chain identifier header */}
              <div className="relative z-10 flex items-center justify-between px-6 pt-4 pb-0">
                <span className="text-[9px] font-mono text-text-secondary/40 uppercase tracking-widest">
                  DuelSnap PvP
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-mono text-text-secondary/40 uppercase tracking-widest">
                    Celo 42220
                  </span>
                </span>
              </div>

              <div className="relative z-10 p-6">
                <AnimatePresence mode="wait">
                  {mm.state === "searching" && (
                    <MatchmakingSearching
                      key="searching"
                      elapsed={mm.elapsed}
                      wager={mm.wager}
                      onCancel={mm.cancel}
                    />
                  )}
                  {mm.state === "found" && mm.opponent && (
                    <MatchmakingFound
                      key="found"
                      opponent={mm.opponent}
                      wager={mm.wager}
                    />
                  )}
                  {mm.state === "countdown" && (
                    <MatchmakingCountdown key="countdown" countdown={mm.countdown} />
                  )}
                  {mm.state === "connection_lost" && (
                    <MatchmakingTimeout
                      key="timeout"
                      onRetry={() => mm.startSearch(mm.wager)}
                      onCancel={mm.cancel}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state triggers the modal */}
      {mm.state === "idle" && (
        <MatchmakingIdle onStart={mm.startSearch} />
      )}
    </>
  );
}
