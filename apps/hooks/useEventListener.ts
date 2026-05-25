"use client";

import { useEffect, useRef } from "react";

type Target = Window | Document | HTMLElement | null;

/**
 * Attaches a typed event listener to a DOM target. Auto-removes on unmount.
 * Callback ref is always fresh — safe to use without memoizing.
 *
 * @param eventName - DOM event name (e.g. 'click', 'keydown', 'resize')
 * @param handler - Event handler function
 * @param element - Target element (default: `window`)
 * @param options - AddEventListener options
 *
 * @example
 * // Global resize
 * useEventListener('resize', handleResize);
 *
 * // Escape key on document
 * useEventListener('keydown', (e) => {
 *   if (e.key === 'Escape') closeModal();
 * }, document);
 *
 * // Click on a ref
 * const ref = useRef<HTMLDivElement>(null);
 * useEventListener('click', handleClick, ref.current);
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Target,
  options?: AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const target = element !== undefined ? element : window;
    if (!target || !target.addEventListener) return;

    const listener = (event: Event) =>
      savedHandler.current(event as WindowEventMap[K]);

    target.addEventListener(eventName, listener, options);
    return () => target.removeEventListener(eventName, listener, options);
  }, [eventName, element, options]);
}
