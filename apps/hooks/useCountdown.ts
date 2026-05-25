"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface CountdownOptions {
  /** Starting value in milliseconds */
  initialMs: number;
  /** Called when countdown reaches 0 */
  onExpire?: () => void;
  /** Auto-start on mount (default: true) */
  autoStart?: boolean;
}

interface CountdownReturn {
  /** Remaining milliseconds */
  remainingMs: number;
  /** Remaining seconds (rounded down) */
  remainingSec: number;
  /** 0–1 progress ratio (1 = full, 0 = expired) */
  progress: number;
  /** Whether countdown is currently running */
  isRunning: boolean;
  /** Whether countdown has reached 0 */
  isExpired: boolean;
  /** Start or resume the countdown */
  start: () => void;
  /** Pause the countdown */
  pause: () => void;
  /** Reset to initial value and stop */
  reset: () => void;
  /** Reset and immediately start */
  restart: () => void;
}

/**
 * Accurate countdown timer with start/pause/reset controls.
 * Uses wall-clock time to avoid drift from interval jitter.
 *
 * @example
 * const { remainingSec, progress, isExpired, restart } = useCountdown({
 *   initialMs: 30_000,
 *   onExpire: () => handleTimeout(),
 * });
 * <TimerBar progress={progress} />
 * <span>{remainingSec}s</span>
 */
export function useCountdown({
  initialMs,
  onExpire,
  autoStart = true,
}: CountdownOptions): CountdownReturn {
  const [remainingMs, setRemainingMs] = useState(initialMs);
  const [isRunning, setIsRunning] = useState(autoStart);

  const endAtRef = useRef<number | null>(autoStart ? Date.now() + initialMs : null);
  const expiredRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (!endAtRef.current) return;
    const left = Math.max(0, endAtRef.current - Date.now());
    setRemainingMs(left);

    if (left === 0 && !expiredRef.current) {
      expiredRef.current = true;
      setIsRunning(false);
      onExpire?.();
      return;
    }

    if (left > 0) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [onExpire]);

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, tick]);

  const start = useCallback(() => {
    if (expiredRef.current) return;
    endAtRef.current = Date.now() + remainingMs;
    setIsRunning(true);
  }, [remainingMs]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    expiredRef.current = false;
    endAtRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setRemainingMs(initialMs);
  }, [initialMs]);

  const restart = useCallback(() => {
    expiredRef.current = false;
    endAtRef.current = Date.now() + initialMs;
    setRemainingMs(initialMs);
    setIsRunning(true);
  }, [initialMs]);

  return {
    remainingMs,
    remainingSec: Math.ceil(remainingMs / 1000),
    progress: initialMs > 0 ? remainingMs / initialMs : 0,
    isRunning,
    isExpired: remainingMs === 0,
    start,
    pause,
    reset,
    restart,
  };
}
