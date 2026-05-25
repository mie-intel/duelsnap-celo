"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Returns a debounced version of the value.
 * Useful for search inputs, form validation, etc.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * useEffect(() => fetchResults(debouncedSearch), [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a debounced callback function.
 * The callback is stable across renders (safe as useEffect dep).
 *
 * @example
 * const debouncedSave = useDebouncedCallback(save, 500);
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  const fnRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep ref updated without recreating the debounced wrapper
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay],
  );
}
