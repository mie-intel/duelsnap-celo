/**
 * Animated pulsing dot indicator.
 * Used for live status, online indicators, activity.
 */

interface PulseDotProps {
  color?: "green" | "yellow" | "red" | "primary";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const COLOR_CLASSES: Record<NonNullable<PulseDotProps["color"]>, { dot: string; ring: string }> = {
  green:   { dot: "bg-success",           ring: "bg-success/40" },
  yellow:  { dot: "bg-[#f59e0b]",         ring: "bg-[#f59e0b]/40" },
  red:     { dot: "bg-error",             ring: "bg-error/40" },
  primary: { dot: "bg-primary",           ring: "bg-primary/40" },
};

const SIZE_CLASSES: Record<NonNullable<PulseDotProps["size"]>, { dot: string; ring: string }> = {
  sm: { dot: "w-1.5 h-1.5", ring: "w-3 h-3" },
  md: { dot: "w-2.5 h-2.5", ring: "w-5 h-5" },
  lg: { dot: "w-3.5 h-3.5", ring: "w-7 h-7" },
};

/**
 * @example
 * <PulseDot color="green" label="Live" />
 * <PulseDot color="primary" size="sm" />
 */
export function PulseDot({
  color = "green",
  size = "md",
  label,
  className = "",
}: PulseDotProps) {
  const { dot, ring } = COLOR_CLASSES[color];
  const sizes = SIZE_CLASSES[size];

  return (
    <span
      role="status"
      aria-label={label ?? "Active"}
      className={["relative inline-flex items-center justify-center", sizes.ring, className].join(" ")}
    >
      <span className={["absolute rounded-full animate-ping opacity-75", sizes.ring, ring].join(" ")} />
      <span className={["relative rounded-full", sizes.dot, dot].join(" ")} />
    </span>
  );
}
