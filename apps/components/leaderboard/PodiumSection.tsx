"use client";

import type { LeaderboardEntry } from "./LeaderboardRow";

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatCelo(wei: number): string {
  const celo = wei / 1e18;
  return celo >= 1 ? celo.toFixed(2) : celo.toFixed(4);
}

interface PodiumCardProps {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
}

const PODIUM_CONFIG = {
  1: {
    order: "order-2",
    height: "h-24",
    barHeight: "h-24",
    accentColor: "#FBCC5C",
    glowColor: "rgba(251,204,92,0.25)",
    borderColor: "border-[#FBCC5C]/50",
    bgColor: "bg-[#FBCC5C]/10",
    textColor: "text-[#FBCC5C]",
    label: "1st",
    crown: true,
    avatarSize: "w-16 h-16 text-xl",
  },
  2: {
    order: "order-1",
    height: "h-16",
    barHeight: "h-16",
    accentColor: "#C0C8D8",
    glowColor: "rgba(192,200,216,0.15)",
    borderColor: "border-[#C0C8D8]/40",
    bgColor: "bg-[#C0C8D8]/8",
    textColor: "text-[#C0C8D8]",
    label: "2nd",
    crown: false,
    avatarSize: "w-12 h-12 text-base",
  },
  3: {
    order: "order-3",
    height: "h-12",
    barHeight: "h-12",
    accentColor: "#CD7F32",
    glowColor: "rgba(205,127,50,0.15)",
    borderColor: "border-[#CD7F32]/40",
    bgColor: "bg-[#CD7F32]/8",
    textColor: "text-[#CD7F32]",
    label: "3rd",
    crown: false,
    avatarSize: "w-12 h-12 text-base",
  },
} as const;

function PodiumCard({ entry, position }: PodiumCardProps) {
  const cfg = PODIUM_CONFIG[position];

  return (
    <div className={`flex flex-col items-center gap-2 ${cfg.order} flex-1`}>
      {/* Crown for #1 */}
      {cfg.crown && (
        <span className="text-2xl mb-1 animate-bounce" style={{ animationDuration: "2s" }}>
          👑
        </span>
      )}

      {/* Avatar */}
      <div
        className={`${cfg.avatarSize} rounded-full flex items-center justify-center font-display font-bold border-2 ${cfg.borderColor} ${cfg.bgColor}`}
        style={{ boxShadow: `0 0 20px ${cfg.glowColor}` }}
      >
        <span className={cfg.textColor}>
          {entry.address.slice(2, 4).toUpperCase()}
        </span>
      </div>

      {/* Name + CELO */}
      <div className="text-center">
        <p className="font-mono text-xs text-text-primary">
          {truncateAddress(entry.address)}
        </p>
        <p className={`font-display font-bold text-sm ${cfg.textColor}`}>
          {formatCelo(entry.totalCelo)} CELO
        </p>
      </div>

      {/* Podium bar */}
      <div
        className={`w-full ${cfg.barHeight} rounded-t-xl border-t border-x ${cfg.borderColor} ${cfg.bgColor} flex items-center justify-center`}
        style={{ boxShadow: `inset 0 4px 12px ${cfg.glowColor}` }}
      >
        <span className={`font-display font-bold text-lg ${cfg.textColor}`}>
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

interface PodiumSectionProps {
  top3: LeaderboardEntry[];
}

export function PodiumSection({ top3 }: PodiumSectionProps) {
  if (top3.length < 3) return null;

  return (
    <div className="relative rounded-[2rem] border border-border-subtle bg-surface-1 p-6 mb-4 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(251,204,92,0.08) 0%, transparent 70%)",
        }}
      />

      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-6 text-center relative z-10">
        Top Players
      </p>

      <div className="flex items-end gap-3 relative z-10">
        <PodiumCard entry={top3[1]} position={2} />
        <PodiumCard entry={top3[0]} position={1} />
        <PodiumCard entry={top3[2]} position={3} />
      </div>
    </div>
  );
}
