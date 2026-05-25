"use client";

import { useState, useEffect, useCallback } from "react";

interface ScrollPosition {
  x: number;
  y: number;
  /** Scrolled past `threshold` pixels from top */
  isScrolled: boolean;
  /** User is scrolling down */
  isScrollingDown: boolean;
  /** 0–1 progress through total scrollable height */
  progress: number;
}

/**
 * Tracks window scroll position with direction and progress.
 *
 * @param threshold - pixels from top before `isScrolled` becomes true (default 50)
 *
 * @example
 * const { y, isScrolled, isScrollingDown, progress } = useScrollPosition();
 *
 * // Hide nav when scrolling down, show when scrolling up
 * <nav className={isScrollingDown ? '-translate-y-full' : 'translate-y-0'} />
 *
 * // Sticky header that changes style after scrolling 80px
 * <header className={isScrolled ? 'shadow-md bg-bg-page' : ''} />
 */
export function useScrollPosition(threshold = 50): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    isScrolled: false,
    isScrollingDown: false,
    progress: 0,
  });

  const handleScroll = useCallback(() => {
    const x = window.scrollX;
    const y = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;

    setPosition((prev) => ({
      x,
      y,
      isScrolled: y > threshold,
      isScrollingDown: y > prev.y,
      progress,
    }));
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Set initial value
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return position;
}
