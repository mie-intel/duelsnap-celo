"use client";

import { useState, useEffect } from "react";

/**
 * Debounces a value — returns the value only after it stops changing
 * for `delayMs` milliseconds.
 *
 * @example
 * const [query, setQuery] = useState("");
 * const debouncedQuery = useDebounce(query, 300);
 * // debouncedQuery updates 300ms after query stops changing
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

/**
 * Debounced callback — stabilizes a function reference and
 * delays its execution until `delayMs` ms after the last call.
 *
 * @example
 * const debouncedSearch = useDebouncedCallback(
 *   (q: string) => fetchResults(q),
 *   400,
 * );
 * <input onChange={e => debouncedSearch(e.target.value)} />
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs = 300,
): (...args: Args) => void {
  const timerRef = { current: 0 as unknown as ReturnType<typeof setTimeout> };

  return (...args: Args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delayMs);
  };
}
