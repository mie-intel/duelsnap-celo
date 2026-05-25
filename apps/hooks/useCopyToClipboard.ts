"use client";

import { useState, useCallback } from "react";

interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Copy text to clipboard with temporary "copied" state.
 *
 * @param resetDelay - ms before `copied` resets to false (default 2000)
 *
 * @example
 * const { copied, copy } = useCopyToClipboard();
 * <button onClick={() => copy(referralLink)}>
 *   {copied ? 'Copied!' : 'Copy link'}
 * </button>
 */
export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false;

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers / WebViews
          const el = document.createElement("textarea");
          el.value = text;
          el.style.position = "fixed";
          el.style.top = "-9999px";
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetDelay],
  );

  return { copied, copy };
}
