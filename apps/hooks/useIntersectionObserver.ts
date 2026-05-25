"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Only fire once (default false — keep observing) */
  once?: boolean;
}

/**
 * Observe when an element enters/exits the viewport.
 * Useful for lazy loading, scroll-triggered animations.
 *
 * @example
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 * <div ref={ref} className={isVisible ? 'fade-in' : 'opacity-0'} />
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
): [React.RefObject<T | null>, boolean] {
  const { once = false, ...observerOptions } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.disconnect();
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
    // observerOptions intentionally omitted — users should memoize if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  return [ref, isVisible];
}
