"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * SSR-safe localStorage hook with JSON serialization.
 * Falls back to initialValue when storage is unavailable.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage("theme", "dark");
 * const [volume, setVolume, removeVolume] = useLocalStorage("volume", 0.8);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Sync with storage on mount (handles SSR hydration)
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(e.newValue !== null ? JSON.parse(e.newValue) : initialValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const next = value instanceof Function ? value(readValue()) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        setStoredValue(next);
      } catch {
        console.warn(`useLocalStorage: failed to set "${key}"`);
      }
    },
    [key, readValue],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      console.warn(`useLocalStorage: failed to remove "${key}"`);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
