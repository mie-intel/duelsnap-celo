"use client";

import { memo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

const springSnappy = { stiffness: 400, damping: 30 } as const;
const springSmooth = { type: "spring", stiffness: 100, damping: 20 } as const;

export const TiltCard = memo(function TiltCard({ children, className = "", delay = 0, index = 0 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springSnappy);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springSnappy);
  const scale = useSpring(1, springSnappy);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
    scale.set(1.02);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { rotateX, rotateY, scale, transformPerspective: 900 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...springSmooth, delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
});
