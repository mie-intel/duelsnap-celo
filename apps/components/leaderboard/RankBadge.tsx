"use client";

interface RankBadgeProps {
  rank: number;
  size?: "sm" | "md" | "lg";
}

const MEDAL_CONFIG = {
  1: {
    label: "1st",
    bg: "bg-[#FBCC5C]/15",
    border: "border-[#FBCC5C]/40",
    text: "text-[#FBCC5C]",
    glow: "shadow-[0_0_12px_rgba(251,204,92,0.3)]",
    icon: "👑",
  },
  2: {
    label: "2nd",
    bg: "bg-[#C0C8D8]/10",
    border: "border-[#C0C8D8]/40",
    text: "text-[#C0C8D8]",
    glow: "shadow-[0_0_8px_rgba(192,200,216,0.2)]",
    icon: "🥈",
  },
  3: {
    label: "3rd",
    bg: "bg-[#CD7F32]/10",
    border: "border-[#CD7F32]/40",
    text: "text-[#CD7F32]",
    glow: "shadow-[0_0_8px_rgba(205,127,50,0.2)]",
    icon: "🥉",
  },
} as const;

const SIZE_MAP = {
  sm: { outer: "w-8 h-8 text-xs", number: "text-[10px]" },
  md: { outer: "w-10 h-10 text-sm", number: "text-xs" },
  lg: { outer: "w-14 h-14 text-lg", number: "text-sm" },
};

export function RankBadge({ rank, size = "md" }: RankBadgeProps) {
  const sz = SIZE_MAP[size];

  if (rank <= 3) {
    const medal = MEDAL_CONFIG[rank as 1 | 2 | 3];
    return (
      <div
        className={`${sz.outer} rounded-full flex items-center justify-center border font-display font-bold shrink-0 ${medal.bg} ${medal.border} ${medal.text} ${medal.glow}`}
        aria-label={`Rank ${medal.label}`}
      >
        <span className={sz.number}>{rank}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sz.outer} rounded-full flex items-center justify-center border border-border-subtle bg-surface-1 font-mono shrink-0`}
      aria-label={`Rank ${rank}`}
    >
      <span className={`${sz.number} text-text-secondary`}>{rank}</span>
    </div>
  );
}
