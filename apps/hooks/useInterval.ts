"use client";

import { useEffect, useRef } from "react";

/**
 * Safe setInterval hook that always calls the latest callback reference.
 * Prevents stale-closure bugs. Stops when `delayMs` is null.
 *
 * @example
 * // Poll every 5 seconds
 * useInterval(() => refetch(), 5_000);
 *
 * // Pause polling
 * useInterval(() => refetch(), isPaused ? null : 5_000);
 */
export function useInterval(
  callback: () => void,
  delayMs: number | null,
): void {
  const callbackRef = useRef(callback);

  // Keep ref in sync with latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs === null) return;
    const id = setInterval(() => callbackRef.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]);
}

/**
 * Like useInterval but fires immediately on mount before the first delay.
 *
 * @example
 * useIntervalImmediate(() => fetchStatus(), 10_000);
 */
export function useIntervalImmediate(
  callback: () => void,
  delayMs: number | null,
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs === null) return;
    callbackRef.current(); // fire immediately
    const id = setInterval(() => callbackRef.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]);
}
