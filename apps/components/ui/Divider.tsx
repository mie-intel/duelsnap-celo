interface DividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Visual divider with optional centered label.
 *
 * @example
 * <Divider />
 * <Divider label="or" />
 * <Divider orientation="vertical" className="h-6" />
 */
export function Divider({
  label,
  orientation = "horizontal",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={["w-px bg-border-subtle shrink-0", className].join(" ")}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={["flex items-center gap-3 my-2", className].join(" ")}
      >
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-secondary font-sans shrink-0">{label}</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={["h-px w-full bg-border-subtle my-2", className].join(" ")}
    />
  );
}
