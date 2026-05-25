import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  selected?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const VARIANT_CLASSES: Record<
  NonNullable<ChipProps["variant"]>,
  { base: string; selected: string }
> = {
  default: {
    base: "bg-surface-2 text-text-secondary border-surface-3 hover:border-text-secondary/30",
    selected: "bg-surface-3 text-text-primary border-text-secondary/40",
  },
  primary: {
    base: "bg-primary/10 text-primary border-primary/20 hover:border-primary/40",
    selected: "bg-primary/20 text-primary border-primary/60",
  },
  success: {
    base: "bg-success/10 text-success border-success/20 hover:border-success/40",
    selected: "bg-success/20 text-success border-success/60",
  },
  warning: {
    base: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 hover:border-[#f59e0b]/40",
    selected: "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/60",
  },
  error: {
    base: "bg-error/10 text-error border-error/20 hover:border-error/40",
    selected: "bg-error/20 text-error border-error/60",
  },
};

const SIZE_CLASSES: Record<NonNullable<ChipProps["size"]>, string> = {
  sm: "text-xs px-2.5 py-1 gap-1.5",
  md: "text-sm px-3 py-1.5 gap-2",
};

/**
 * Chip / tag for filtering, categories, or selection.
 *
 * @example
 * // Static tag
 * <Chip variant="primary">Science</Chip>
 *
 * // Selectable filter chip
 * <Chip selected={active} onClick={toggle} variant="primary">Sports</Chip>
 *
 * // Dismissible tag
 * <Chip dismissible onDismiss={remove}>Geography</Chip>
 */
export function Chip({
  children,
  variant = "default",
  size = "md",
  selected = false,
  dismissible = false,
  onDismiss,
  onClick,
  icon,
  className = "",
  disabled = false,
}: ChipProps) {
  const styles = VARIANT_CLASSES[variant];
  const isInteractive = !!onClick && !disabled;

  const Tag = isInteractive ? "button" : "span";

  return (
    <Tag
      {...(isInteractive
        ? {
            type: "button" as const,
            onClick,
            disabled,
            "aria-pressed": selected,
          }
        : {})}
      className={[
        "inline-flex items-center border rounded-full font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        selected ? styles.selected : styles.base,
        SIZE_CLASSES[size],
        isInteractive ? "cursor-pointer active:scale-95" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {icon && (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      )}
      {children}
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Remove"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-0.5 -mr-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}
    </Tag>
  );
}
