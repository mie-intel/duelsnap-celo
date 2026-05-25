"use client";

import { useState, useEffect } from "react";

/**
 * Returns whether the page is currently visible (not hidden / backgrounded).
 * Useful for pausing timers, animations, or polling when user tabs away.
 *
 * Uses the Page Visibility API (`document.visibilityState`).
 *
 * @example
 * const isVisible = usePageVisibility();
 *
 * useEffect(() => {
 *   if (!isVisible) pauseTimer();
 *   else resumeTimer();
 * }, [isVisible]);
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true
  );

  useEffect(() => {
    const handleChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleChange);
    return () => document.removeEventListener("visibilitychange", handleChange);
  }, []);

  return isVisible;
}
