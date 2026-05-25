"use client";

import type { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
  className?: string;
}

/**
 * Keyboard shortcut display styled like a key cap.
 *
 * @example
 * <p>Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search</p>
 * <p>Use <Kbd>↵ Enter</Kbd> to confirm</p>
 */
export function Kbd({ children, className = "" }: KbdProps) {
  return (
    <kbd
      className={[
        "inline-flex items-center justify-center px-1.5 py-0.5",
        "rounded border border-surface-3 bg-surface-2 text-text-secondary",
        "text-xs font-mono font-medium leading-none",
        "shadow-[0_1px_0_0_rgba(0,0,0,0.4)]",
        className,
      ].join(" ")}
    >
      {children}
    </kbd>
  );
}

interface KbdShortcutProps {
  /** e.g. ["⌘", "K"] or ["Ctrl", "Enter"] */
  keys: string[];
  separator?: ReactNode;
  className?: string;
}

/**
 * Multi-key shortcut display.
 *
 * @example
 * <KbdShortcut keys={["⌘", "K"]} />
 * <KbdShortcut keys={["Ctrl", "Shift", "P"]} />
 */
export function KbdShortcut({
  keys,
  separator = <span className="text-text-muted text-xs mx-0.5">+</span>,
  className = "",
}: KbdShortcutProps) {
  return (
    <span className={["inline-flex items-center gap-0.5", className].join(" ")}>
      {keys.map((key, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && separator}
          <Kbd>{key}</Kbd>
        </span>
      ))}
    </span>
  );
}
