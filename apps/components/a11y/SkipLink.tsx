"use client";

/**
 * Accessibility skip navigation link.
 * Visually hidden until focused — allows keyboard users to skip repeated nav.
 *
 * @example
 * <SkipLink href="#main-content" />
 * <NavBar />
 * <main id="main-content" tabIndex={-1}>
 *   <Outlet />
 * </main>
 */
export function SkipLink({
  href = "#main-content",
  label = "Skip to main content",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      className={[
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[9999]",
        "focus:px-4 focus:py-2 focus:rounded-lg",
        "focus:bg-primary focus:text-white focus:font-semibold focus:text-sm",
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2",
        "transition-all duration-150",
      ].join(" ")}
    >
      {label}
    </a>
  );
}
