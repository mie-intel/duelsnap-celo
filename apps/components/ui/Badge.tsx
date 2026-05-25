interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info" | "primary";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:  "bg-surface-2 text-text-secondary",
  primary:  "bg-primary/15 text-primary",
  success:  "bg-success/15 text-success",
  error:    "bg-error/15 text-error",
  warning:  "bg-[#f59e0b]/15 text-[#f59e0b]",
  info:     "bg-[#0891b2]/15 text-[#0891b2]",
};

const SIZE_CLASSES: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
};

/**
 * Status badge / label pill.
 *
 * @example
 * <Badge variant="success">Live</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 font-semibold rounded-full font-sans",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-current shrink-0"
        />
      )}
      {children}
    </span>
  );
}
