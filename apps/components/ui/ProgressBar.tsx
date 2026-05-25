interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  size?: "xs" | "sm" | "md";
  color?: "primary" | "success" | "error" | "warning";
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

const COLOR_CLASSES: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  primary: "bg-primary",
  success: "bg-success",
  error: "bg-error",
  warning: "bg-[#f59e0b]",
};

const HEIGHT_CLASSES: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  xs: "h-1",
  sm: "h-2",
  md: "h-3",
};

/**
 * Accessible progress bar.
 *
 * @example
 * <ProgressBar value={75} color="primary" showLabel />
 * <ProgressBar value={remaining} max={30} color="error" size="xs" animated />
 */
export function ProgressBar({
  value,
  max = 100,
  size = "sm",
  color = "primary",
  animated = false,
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={["flex flex-col gap-1", className].join(" ")}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary font-sans">
          <span>{Math.round(pct)}%</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${Math.round(pct)}% complete`}
        className={[
          "w-full bg-surface-2 rounded-full overflow-hidden",
          HEIGHT_CLASSES[size],
        ].join(" ")}
      >
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            COLOR_CLASSES[color],
            animated ? "animate-pulse" : "",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
