"use client";

import { memo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

const springDramatic = { type: "spring", stiffness: 60, damping: 18 } as const;
const springSnappy = { stiffness: 400, damping: 30 } as const;

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
          : { opacity: 1, y: [0, -10, 0] }
      }
      transition={
        reduced
          ? { ...springDramatic, delay: 0.25 }
          : {
              opacity: { ...springDramatic, delay: 0.25 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
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
      transition={{ duration: 8, repeat: Infinity, ease: "linear", times: [0, 0.85, 1] }}
      style={{ width: "100%" }}
    />
  );
});

/* Scroll-driven drifting glow orbs */
export const GlowOrbs = memo(function GlowOrbs() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const greenY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const goldY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const redY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  if (reduced) {
    return (
      <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full bg-[var(--color-glow-green)] blur-[120px] lg:blur-[160px] opacity-60" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[var(--color-glow-gold)] blur-[100px] opacity-40" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] -translate-x-1/2 rounded-full bg-[var(--color-glow-red)] blur-[120px] opacity-20" />
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Green orb — drift + parallax */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full bg-[var(--color-glow-green)] blur-[120px] lg:blur-[160px]"
        style={{ y: greenY }}
        animate={{ opacity: [0.5, 0.7, 0.5], x: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Gold orb */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-[var(--color-glow-gold)] blur-[100px]"
        style={{ y: goldY }}
        animate={{ opacity: [0.3, 0.5, 0.3], x: [0, -25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Red orb */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[500px] h-[300px] lg:w-[700px] lg:h-[400px] -translate-x-1/2 rounded-full bg-[var(--color-glow-red)] blur-[120px]"
        style={{ y: redY }}
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
});

/* Magnetic CTA button */
export const MagneticButton = memo(function MagneticButton({
  children,
  className = "",
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, springSnappy);
  const sy = useSpring(my, springSnappy);

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  }

  function onLeave() { mx.set(0); my.set(0); }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={reduced ? undefined : { x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.97, y: 1 }}
    >
      {children}
    </motion.a>
  );
});
