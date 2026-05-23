"use client";

import { AnimatePresence, motion } from "framer-motion";

interface MatchmakingCountdownProps {
  countdown: number;
}

const springDramatic = { type: "spring" as const, stiffness: 60, damping: 18 };

export function MatchmakingCountdown({ countdown }: MatchmakingCountdownProps) {
  const label = countdown === 0 ? "FIGHT!" : String(countdown);
  const isFight = countdown === 0;

  return (
    <motion.div
      key="countdown"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-8 gap-6 min-h-[240px]"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-text-secondary/60">
        Duel starting
      </p>
      <div className="relative h-40 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            className={`font-display font-bold select-none ${
              isFight ? "text-6xl text-primary" : "text-[7rem] leading-none text-text-primary"
            }`}
            initial={{ opacity: 0, scale: 2.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={springDramatic}
            style={
              isFight
                ? { textShadow: "0 0 40px rgba(53,208,127,0.6)" }
                : { textShadow: "0 0 20px rgba(248,243,235,0.2)" }
            }
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        {[3, 2, 1].map((tick) => (
          <motion.div
            key={tick}
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor:
                countdown < tick ? "var(--color-border-subtle)" : "var(--color-primary)",
              scale: countdown === tick ? 1.3 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
