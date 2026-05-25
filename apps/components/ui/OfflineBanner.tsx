"use client";

import { useOnlineStatus } from "../../hooks/useOnlineStatus";

/**
 * Sticky banner shown when browser goes offline.
 * Place at top of layout or near the game area.
 */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 inset-x-0 z-[80] flex items-center justify-center gap-2 bg-error px-4 py-2 text-white text-sm font-semibold font-sans shadow-lg"
    >
      <span aria-hidden="true">📡</span>
      No internet connection — on-chain actions unavailable
    </div>
  );
}
