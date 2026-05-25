"use client";

import { useState, useRef, useCallback } from "react";

interface UseHoverReturn<T extends HTMLElement> {
  ref: React.RefObject<T>;
  isHovered: boolean;
}

/**
 * Tracks hover state on a DOM element via a ref.
 *
 * @example
 * const { ref, isHovered } = useHover<HTMLButtonElement>();
 *
 * <button ref={ref} className={isHovered ? 'scale-105' : ''}>
 *   Hover me
 * </button>
 */
export function useHover<T extends HTMLElement = HTMLElement>(): UseHoverReturn<T> {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Attach listeners imperatively so we can target the actual DOM node
  const setRef = useCallback(
    (node: T | null) => {
      if (ref.current) {
        ref.current.removeEventListener("mouseenter", handleMouseEnter);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      // @ts-expect-error - assigning to ref.current
      ref.current = node;

      if (node) {
        node.addEventListener("mouseenter", handleMouseEnter);
        node.addEventListener("mouseleave", handleMouseLeave);
      }
    },
    [handleMouseEnter, handleMouseLeave]
  );

  return { ref: { current: ref.current } as React.RefObject<T>, isHovered };
}
