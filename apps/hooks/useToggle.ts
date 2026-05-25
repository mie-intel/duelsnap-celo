"use client";

import { useState, useCallback } from "react";

/**
 * Boolean toggle state with stable toggle/setOn/setOff functions.
 *
 * @example
 * const [isOpen, toggle, open, close] = useToggle();
 * const [muted, toggleMute] = useToggle(false);
 */
export function useToggle(
  initialValue = false,
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setOn  = useCallback(() => setValue(true), []);
  const setOff = useCallback(() => setValue(false), []);
  return [value, toggle, setOn, setOff];
}
