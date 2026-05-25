/**
 * Rank tier badge based on CELO earned or win count.
 * Tiers: Beginner → Bronze → Silver → Gold → Diamond → Legend
 */

export type RankTier = "beginner" | "bronze" | "silver" | "gold" | "diamond" | "legend";

const TIER_CONFIG: Record<
  RankTier,
  { label: string; emoji: string; color: string; bg: string; minWins: number }
> = {
  beginner:  { label: "Beginner",  emoji: "🌱", color: "text-text-secondary", bg: "bg-surface-2",          minWins: 0   },
  bronze:    { label: "Bronze",    emoji: "🥉", color: "text-[#cd7f32]",      bg: "bg-[#cd7f32]/10",       minWins: 5   },
  silver:    { label: "Silver",    emoji: "🥈", color: "text-[#a8a9ad]",      bg: "bg-[#a8a9ad]/10",       minWins: 20  },
  gold:      { label: "Gold",      emoji: "🥇", color: "text-[#ffd700]",      bg: "bg-[#ffd700]/10",       minWins: 50  },
  diamond:   { label: "Diamond",   emoji: "💎", color: "text-[#4f9cf9]",      bg: "bg-[#4f9cf9]/10",       minWins: 100 },
  legend:    { label: "Legend",    emoji: "👑", color: "text-primary",        bg: "bg-primary/10",          minWins: 250 },
};

/** Derive tier from win count */
export function tierFromWins(wins: number): RankTier {
  if (wins >= 250) return "legend";
  if (wins >= 100) return "diamond";
  if (wins >= 50)  return "gold";
  if (wins >= 20)  return "silver";
  if (wins >= 5)   return "bronze";
  return "beginner";
}

interface RankBadgeProps {
  wins?: number;
  tier?: RankTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-2 gap-2",
} as const;

/**
 * Rank tier badge. Pass either `wins` (auto-calculates tier) or explicit `tier`.
 *
 * @example
 * <RankBadge wins={75} size="sm" />
 * <RankBadge tier="legend" showLabel />
 */
export function RankBadge({
  wins,
  tier,
  size = "md",
  showLabel = true,
  className = "",
}: RankBadgeProps) {
  const resolved = tier ?? (wins !== undefined ? tierFromWins(wins) : "beginner");
  const { label, emoji, color, bg } = TIER_CONFIG[resolved];

  return (
    <span
      aria-label={`Rank: ${label}`}
      className={[
        "inline-flex items-center font-semibold rounded-full font-sans",
        SIZE_CLASSES[size],
        color,
        bg,
        className,
      ].join(" ")}
    >
      <span aria-hidden="true">{emoji}</span>
      {showLabel && <span>{label}</span>}
    </span>
  );
}
