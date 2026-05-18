"use client";

import { useEffect, useRef } from "react";

interface AnimatedGlowProps {
  color: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  duration?: number;
}

export default function AnimatedGlow({
  color,
  size = 500,
  top,
  left,
  right,
  bottom,
  opacity = 0.5,
  duration = 6000,
}: AnimatedGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let start: number | null = null;
    let raf: number;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = ((ts - start) % duration) / duration;
      const scale = 1 + 0.08 * Math.sin(progress * Math.PI * 2);
      const o = opacity * (0.85 + 0.15 * Math.cos(progress * Math.PI * 2));
      el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = String(o);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [opacity, duration]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${size * 0.22}px)`,
        transform: "translate(-50%, -50%)",
        opacity,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    />
  );
}
