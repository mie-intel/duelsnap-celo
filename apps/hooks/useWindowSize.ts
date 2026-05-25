"use client";

import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const BREAKPOINTS = {
  mobile: 640,  // sm
  tablet: 1024, // lg
} as const;

/**
 * Tracks window dimensions with breakpoint helpers.
 * SSR-safe — returns 0/false on server.
 *
 * @example
 * const { isMobile, width } = useWindowSize();
 * if (isMobile) return <MobileView />;
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>(() => {
    if (typeof window === "undefined") {
      return { width: 0, height: 0, isMobile: false, isTablet: false, isDesktop: false };
    }
    return derive(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    let rafId: number;

    function onResize() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setSize(derive(window.innerWidth, window.innerHeight));
      });
    }

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return size;
}

function derive(width: number, height: number): WindowSize {
  return {
    width,
    height,
    isMobile: width < BREAKPOINTS.mobile,
    isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
    isDesktop: width >= BREAKPOINTS.tablet,
  };
}
