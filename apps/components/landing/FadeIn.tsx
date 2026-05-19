"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** direction of entry: up (default), left, right */
  from?: "up" | "left" | "right";
}

const springSmooth = { type: "spring", stiffness: 100, damping: 20 } as const;

export default function FadeIn({ children, delay = 0, className = "", from = "up" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden =
    reduced
      ? { opacity: 0 }
      : from === "left"
      ? { opacity: 0, x: -24 }
      : from === "right"
      ? { opacity: 0, x: 24 }
      : { opacity: 0, y: 22 };

  const visible =
    reduced
      ? { opacity: 1 }
      : from === "left" || from === "right"
      ? { opacity: 1, x: 0 }
      : { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? visible : hidden}
      transition={{ ...springSmooth, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
