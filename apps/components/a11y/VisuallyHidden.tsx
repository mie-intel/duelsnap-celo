"use client";

import type { ReactNode } from "react";

/**
 * Renders content that is visually hidden but available to screen readers.
 *
 * @example
 * <button>
 *   <HeartIcon aria-hidden />
 *   <VisuallyHidden>Add to favorites</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
