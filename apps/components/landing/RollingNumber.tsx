"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";

const DIGIT_HEIGHT = 44;

interface RollingNumberProps {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

/* Single animated digit slot */
function DigitSlot({ char }: { char: string }) {
  const isDigit = /\d/.test(char);
  const num = isDigit ? parseInt(char, 10) : 0;
  const spring = useSpring(0, { stiffness: 80, damping: 16 });
  const y = useTransform(spring, (v) => {
    const place = Math.round(v) % 10;
    const offset = ((num - place + 10) % 10) * -DIGIT_HEIGHT;
    return offset;
  });

  useEffect(() => {
    if (isDigit) spring.set(num);
  }, [num, spring, isDigit]);

  if (!isDigit) {
    return <span>{char}</span>;
  }

  return (
    <span
      className="relative inline-block overflow-hidden tabular-nums"
      style={{ height: DIGIT_HEIGHT, width: "0.6em", verticalAlign: "bottom" }}
      aria-label={char}
    >
      <motion.span
        className="absolute inset-x-0 flex flex-col items-center"
        style={{ y, top: 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span
            key={d}
            className="flex items-end justify-center"
            style={{ height: DIGIT_HEIGHT }}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/* Viewport-triggered rolling number */
export const RollingNumber = memo(function RollingNumber({
  value,
  className = "",
  style,
}: RollingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reduced) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={`inline-flex items-end ${className}`}
      style={style}
      aria-label={value}
    >
      {triggered
        ? value.split("").map((char, i) => <DigitSlot key={i} char={char} />)
        : value.split("").map((char, i) => (
            <span key={i} className="opacity-0">
              {char}
            </span>
          ))}
    </span>
  );
});
