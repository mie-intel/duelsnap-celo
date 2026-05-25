interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: { wrap: "py-8 gap-2", emoji: "text-3xl", title: "text-base", desc: "text-xs" },
  md: { wrap: "py-12 gap-3", emoji: "text-4xl", title: "text-lg", desc: "text-sm" },
  lg: { wrap: "py-20 gap-4", emoji: "text-6xl", title: "text-2xl", desc: "text-base" },
} as const;

/**
 * Generic empty state for lists, pages, search results.
 *
 * @example
 * <EmptyState
 *   emoji="🎮"
 *   title="No games yet"
 *   description="Play your first game to see stats here."
 *   action={<Button size="sm">Play Now</Button>}
 * />
 */
export function EmptyState({
  emoji = "📭",
  title,
  description,
  action,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const s = SIZE_CLASSES[size];

  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center px-6",
        s.wrap,
        className,
      ].join(" ")}
    >
      <span aria-hidden="true" className={s.emoji}>{emoji}</span>
      <p className={["font-display font-bold text-text-primary", s.title].join(" ")}>
        {title}
      </p>
      {description && (
        <p className={["text-text-secondary font-sans max-w-xs", s.desc].join(" ")}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
