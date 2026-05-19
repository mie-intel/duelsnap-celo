"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const springDramatic = { type: "spring", stiffness: 60, damping: 18 } as const;
const springSmooth = { type: "spring", stiffness: 100, damping: 20 } as const;

/* Staggered hero text reveal */
export const HeroReveal = memo(function HeroReveal({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ ...springDramatic, delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
});

/* Floating game card wrapper */
export const FloatingCard = memo(function FloatingCard({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={
        reduced
          ? { opacity: 1, y: 0 }
          : {
              opacity: 1,
              y: [0, -10, 0],
            }
      }
      transition={
        reduced
          ? { ...springDramatic, delay: 0.25 }
          : {
              opacity: { ...springDramatic, delay: 0.25 },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              },
            }
      }
    >
      {children}
    </motion.div>
  );
});

/* Animated timer bar — loops drain → reset */
export const AnimatedTimerBar = memo(function AnimatedTimerBar() {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
    );
  }
  return (
    <motion.div
      className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
      initial={{ scaleX: 1, originX: 0 }}
      animate={{ scaleX: [1, 0.05, 1] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.85, 1],
      }}
      style={{ width: "100%" }}
    />
  );
});

/* Drifting glow orbs */
export const GlowOrbs = memo(function GlowOrbs() {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full bg-[var(--color-glow-green)] blur-[120px] lg:blur-[160px] opacity-60" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[var(--color-glow-gold)] blur-[100px] opacity-40" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] lg:w-[700px] lg:h-[400px] -translate-x-1/2 rounded-full bg-[var(--color-glow-red)] blur-[120px] opacity-20" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Green orb — slow drift */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full bg-[var(--color-glow-green)] blur-[120px] lg:blur-[160px]"
        animate={{ opacity: [0.5, 0.7, 0.5], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Gold orb — opposite drift */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[var(--color-glow-gold)] blur-[100px]"
        animate={{ opacity: [0.3, 0.5, 0.3], x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Red orb — subtle pulse */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[500px] h-[300px] lg:w-[700px] lg:h-[400px] -translate-x-1/2 rounded-full bg-[var(--color-glow-red)] blur-[120px]"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
});
