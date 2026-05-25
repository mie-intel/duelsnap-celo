"use client";

import { useEffect, useRef, useState } from "react";

export interface UseAnimatedCounterOptions {
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Target value. */
  to: number;
  /** Animation duration in ms. Defaults to 800. */
  duration?: number;
  /** Easing function. Defaults to easeOutCubic. */
  easing?: (t: number) => number;
  /** Decimal places to round displayed value to. Defaults to 0. */
  decimals?: number;
  /** Delay before animation starts (ms). Defaults to 0. */
  delay?: number;
}

export interface UseAnimatedCounterResult {
  /** Current animated value (use for display). */
  value: number;
  /** Formatted string with correct decimal places. */
  formatted: string;
  /** True while animation is running. */
  isAnimating: boolean;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutExpo  = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const linear       = (t: number) => t;

export const Easings = { easeOutCubic, easeOutExpo, linear };

/**
 * Smoothly animates a number from `from` to `to` using requestAnimationFrame.
 * Useful for score reveals, XP counters, and balance tickers.
 *
 * @example
 * const { formatted } = useAnimatedCounter({ to: score, duration: 1000, decimals: 0 });
 * return <span>{formatted}</span>;
 */
export function useAnimatedCounter({
  from = 0,
  to,
  duration = 800,
  easing = easeOutCubic,
  decimals = 0,
  delay = 0,
}: UseAnimatedCounterOptions): UseAnimatedCounterResult {
  const [value, setValue] = useState<number>(from);
  const [isAnimating, setIsAnimating] = useState(false);

  const rafRef     = useRef<number | null>(null);
  const startRef   = useRef<number | null>(null);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cancel any in-flight animation
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (delayTimer.current !== null) clearTimeout(delayTimer.current);

    const startValue = from;
    const delta      = to - startValue;

    if (delta === 0) {
      setValue(to);
      setIsAnimating(false);
      return;
    }

    const run = () => {
      setIsAnimating(true);

      const step = (timestamp: number) => {
        if (startRef.current === null) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        setValue(startValue + delta * easedProgress);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setValue(to);
          setIsAnimating(false);
          startRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(step);
    };

    if (delay > 0) {
      delayTimer.current = setTimeout(run, delay);
    } else {
      run();
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (delayTimer.current !== null) clearTimeout(delayTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, from, duration, delay]);

  const formatted = value.toFixed(decimals);

  return { value, formatted, isAnimating };
}
