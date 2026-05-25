"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Returns true while a specific key is pressed.
 *
 * @example
 * const isEnterPressed = useKeyPress("Enter");
 * const isEscPressed = useKeyPress("Escape");
 */
export function useKeyPress(targetKey: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === targetKey) setPressed(true); };
    const up   = (e: KeyboardEvent) => { if (e.key === targetKey) setPressed(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [targetKey]);

  return pressed;
}

/**
 * Calls a callback when a key is pressed (with optional modifier checks).
 *
 * @example
 * // Close modal on Escape
 * useKeyDown("Escape", close);
 *
 * // Cmd+K shortcut
 * useKeyDown("k", openSearch, { meta: true });
 */
export function useKeyDown(
  key: string,
  callback: (e: KeyboardEvent) => void,
  modifiers?: { ctrl?: boolean; meta?: boolean; shift?: boolean; alt?: boolean },
): void {
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== key) return;
      if (modifiers?.ctrl  && !e.ctrlKey)  return;
      if (modifiers?.meta  && !e.metaKey)  return;
      if (modifiers?.shift && !e.shiftKey) return;
      if (modifiers?.alt   && !e.altKey)   return;
      stableCallback(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, modifiers?.ctrl, modifiers?.meta, modifiers?.shift, modifiers?.alt, stableCallback]);
}
