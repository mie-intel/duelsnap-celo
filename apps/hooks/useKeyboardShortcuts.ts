"use client";

import { useEffect } from "react";

type KeyHandler = (e: KeyboardEvent) => void;
type ShortcutMap = Record<string, KeyHandler>;

/**
 * Registers keyboard shortcuts for the duration of the component's life.
 * Keys are case-insensitive. Modifier support: Ctrl+key, Alt+key, Shift+key.
 *
 * @example
 * useKeyboardShortcuts({
 *   Escape: () => onClose(),
 *   'ctrl+enter': (e) => { e.preventDefault(); onSubmit(); },
 * });
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  deps: unknown[] = [],
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Don't fire inside text inputs unless explicitly handled
      const tag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      const parts: string[] = [];
      if (e.ctrlKey) parts.push("ctrl");
      if (e.altKey) parts.push("alt");
      if (e.shiftKey) parts.push("shift");
      parts.push(e.key.toLowerCase());

      const combo = parts.join("+");

      const fn =
        shortcuts[combo] ??
        shortcuts[e.key] ??
        shortcuts[e.key.toLowerCase()];

      if (fn) fn(e);
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Game-specific shortcuts:
 * Enter → submit answer
 * Escape → skip / go home
 */
export function useGameShortcuts({
  onSubmit,
  onSkip,
}: {
  onSubmit?: () => void;
  onSkip?: () => void;
}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Allow Enter inside inputs for natural form submit
      if (e.key === "Escape") {
        e.preventDefault();
        onSkip?.();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSubmit, onSkip]);
}
