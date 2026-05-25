import type { ReactNode } from "react";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const VARIANT_CLASSES: Record<
  NonNullable<AlertProps["variant"]>,
  { container: string; icon: string; title: string }
> = {
  info: {
    container: "bg-[#0891b2]/10 border-[#0891b2]/30",
    icon: "text-[#0891b2]",
    title: "text-[#0891b2]",
  },
  success: {
    container: "bg-success/10 border-success/30",
    icon: "text-success",
    title: "text-success",
  },
  warning: {
    container: "bg-[#f59e0b]/10 border-[#f59e0b]/30",
    icon: "text-[#f59e0b]",
    title: "text-[#f59e0b]",
  },
  error: {
    container: "bg-error/10 border-error/30",
    icon: "text-error",
    title: "text-error",
  },
};

const DEFAULT_ICONS: Record<NonNullable<AlertProps["variant"]>, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
};

/**
 * Alert banner for status messages, warnings, or errors.
 *
 * @example
 * <Alert variant="success" title="Transaction confirmed!">
 *   Your bet was placed successfully.
 * </Alert>
 *
 * <Alert variant="error" onDismiss={() => setError(null)}>
 *   Failed to connect wallet.
 * </Alert>
 */
export function Alert({
  variant = "info",
  title,
  children,
  icon,
  onDismiss,
  className = "",
}: AlertProps) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <div
      role="alert"
      className={[
        "flex items-start gap-3 p-4 rounded-2xl border",
        styles.container,
        className,
      ].join(" ")}
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        className={["text-base font-bold shrink-0 mt-0.5", styles.icon].join(
          " "
        )}
      >
        {icon ?? DEFAULT_ICONS[variant]}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={["text-sm font-semibold mb-1", styles.title].join(" ")}>
            {title}
          </p>
        )}
        <div className="text-sm text-text-secondary">{children}</div>
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 text-text-secondary hover:text-text-primary transition-colors mt-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
