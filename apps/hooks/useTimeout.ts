"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseTimeoutReturn {
  /** Schedule the timeout (restarts if already running) */
  set: () => void;
  /** Cancel any pending timeout */
  clear: () => void;
}

/**
 * Declarative `setTimeout` hook. Auto-clears on unmount.
 * Callback ref is always fresh — safe to use without memoizing.
 *
 * @param callback - Function to run after the delay
 * @param delay - Delay in ms
 *
 * @example
 * // Show a toast for 3 seconds
 * const { set: show, clear: dismiss } = useTimeout(() => setToast(false), 3000);
 *
 * // Trigger on event
 * <button onClick={show}>Show notification</button>
 */
export function useTimeout(
  callback: () => void,
  delay: number
): UseTimeoutReturn {
  const savedCallback = useRef<() => void>(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep ref updated
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const set = useCallback(() => {
    clear();
    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
      timeoutRef.current = null;
    }, delay);
  }, [delay, clear]);

  // Cleanup on unmount
  useEffect(() => clear, [clear]);

  return { set, clear };
}
