"use client";

import { useState, useCallback } from "react";

interface UseClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Whether last copy succeeded */
  copied: boolean;
  /** Error if last copy failed */
  error: Error | null;
}

/**
 * Copy text to clipboard with success feedback.
 * Resets `copied` flag after `resetMs` (default 2000ms).
 *
 * @example
 * const { copy, copied } = useClipboard();
 * <button onClick={() => copy(address)}>
 *   {copied ? "Copied!" : "Copy Address"}
 * </button>
 */
export function useClipboard(resetMs = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      setError(null);

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers / non-HTTPS
          const el = document.createElement("textarea");
          el.value = text;
          el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Clipboard unavailable");
        setError(e);
        setCopied(false);
        return false;
      }
    },
    [resetMs],
  );

  return { copy, copied, error };
}
