"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface CountdownOptions {
  /** Initial seconds */
  seconds: number;
  /** Auto-start on mount (default true) */
  autoStart?: boolean;
  /** Called when countdown reaches 0 */
  onComplete?: () => void;
  /** Called each tick with remaining seconds */
  onTick?: (remaining: number) => void;
}

interface CountdownResult {
  remaining: number;
  isRunning: boolean;
  isComplete: boolean;
  /** 0–1, decreases as time passes */
  progress: number;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
}

/**
 * Countdown timer hook for game time limits.
 *
 * @example
 * const { remaining, progress, isComplete } = useCountdown({
 *   seconds: 30,
 *   onComplete: handleTimeOut,
 * });
 */
export function useCountdown({
  seconds,
  autoStart = true,
  onComplete,
  onTick,
}: CountdownOptions): CountdownResult {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);
  const initialSeconds = useRef(seconds);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  });

  // Reset when initial seconds prop changes (new question)
  useEffect(() => {
    initialSeconds.current = seconds;
    setRemaining(seconds);
    setIsRunning(autoStart);
  }, [seconds, autoStart]);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        onTickRef.current?.(next);
        if (next <= 0) {
          setIsRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, remaining]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds?: number) => {
    const s = newSeconds ?? initialSeconds.current;
    initialSeconds.current = s;
    setRemaining(s);
    setIsRunning(autoStart);
  }, [autoStart]);

  return {
    remaining,
    isRunning,
    isComplete: remaining <= 0,
    progress: initialSeconds.current > 0 ? remaining / initialSeconds.current : 0,
    start,
    pause,
    reset,
  };
}
