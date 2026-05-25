"use client";

import { useRef, useEffect } from "react";

/**
 * Returns the previous value of a state or prop from the last render.
 * Returns `undefined` on first render.
 *
 * @example
 * const prevScore = usePrevious(score);
 * const increased = score > (prevScore ?? 0);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }); // intentionally no dep array — runs after every render

  return ref.current;
}

/**
 * Like usePrevious but only updates when a condition is true.
 * Useful for ignoring certain transitions.
 *
 * @example
 * // Only track previous score when game is active
 * const prevScore = usePreviousWhen(score, isPlaying);
 */
export function usePreviousWhen<T>(value: T, condition: boolean): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (condition) ref.current = value;
  });

  return ref.current;
}
