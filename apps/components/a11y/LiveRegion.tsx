"use client";

import { useEffect, useState } from "react";

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
}

/**
 * Announces dynamic content to screen readers via ARIA live region.
 *
 * @example
 * <LiveRegion message={`Score: ${score}`} />
 * <LiveRegion message="Time running out!" politeness="assertive" />
 */
export function LiveRegion({ message, politeness = "polite" }: LiveRegionProps) {
  const [announced, setAnnounced] = useState("");

  useEffect(() => {
    setAnnounced("");
    const timer = setTimeout(() => setAnnounced(message), 100);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <span aria-live={politeness} aria-atomic="true" className="sr-only">
      {announced}
    </span>
  );
}
