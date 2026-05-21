import type { Variants } from "framer-motion";

export const stateSlide: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: { type: "spring", stiffness: 300, damping: 28, duration: 0.2 },
  },
};

export const stateScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

export const modalSheet: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 32,
    scale: 0.97,
    transition: { type: "spring", stiffness: 300, damping: 32 },
  },
};

export const springSnappy = { type: "spring", stiffness: 400, damping: 30 } as const;
export const springSmooth = { type: "spring", stiffness: 100, damping: 20 } as const;
export const springDramatic = { type: "spring", stiffness: 60, damping: 18 } as const;
