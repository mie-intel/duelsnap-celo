"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreDisplayProps {
  value: number;
  /** Animate count-up from 0 to value */
  animate?: boolean;
  /** Duration of count-up animation in ms */
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4;
}

/**
 * Animated number display with count-up animation.
 * Uses requestAnimationFrame for smooth rendering.
 *
 * @example
 * <ScoreDisplay value={1234} animate suffix=" CELO" />
 * <ScoreDisplay value={wins} animate={false} />
 */
export function ScoreDisplay({
  value,
  animate = true,
  duration = 1200,
  prefix = "",
  suffix = "",
  className = "",
}: ScoreDisplayProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : value);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayed(value);
      return;
    }

    const startValue = 0;
    const endValue = value;

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      setDisplayed(Math.round(startValue + (endValue - startValue) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    startRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, animate, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayed.toLocaleString()}
      {suffix}
    </span>
  );
}
