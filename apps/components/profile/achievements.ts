import type { GameLogEntry } from "../../hooks/usePlayerLog";

export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string; // SVG path d attribute
  condition: (stats: { total: number; wins: number; entries: GameLogEntry[] }) => boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

function checkStreak(entries: GameLogEntry[], n: number): boolean {
  if (entries.length < n) return false;
  // Sort most-recent first
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  for (let i = 0; i < n; i++) {
    if (sorted[i].result !== "win") return false;
  }
  return true;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_win",
    label: "First Blood",
    description: "Win your first game",
    // Trophy icon path
    icon: "M6 2v6l-2 4h16l-2-4V2H6zM8 2h8M4 12h16M9 22V12M15 22V12M12 22h0",
    condition: (s) => s.wins >= 1,
    rarity: "common",
  },
  {
    id: "ten_games",
    label: "Veteran",
    description: "Play 10 games",
    // Shield icon path
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    condition: (s) => s.total >= 10,
    rarity: "common",
  },
  {
    id: "win_streak_3",
    label: "On Fire",
    description: "Win 3 games in a row",
    // Flame icon path
    icon: "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z",
    condition: (s) => checkStreak(s.entries, 3),
    rarity: "rare",
  },
  {
    id: "fifty_wins",
    label: "Champion",
    description: "Win 50 games",
    // Star icon path
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    condition: (s) => s.wins >= 50,
    rarity: "epic",
  },
  {
    id: "hundred_games",
    label: "Legend",
    description: "Play 100 games",
    // Crown icon path
    icon: "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14",
    condition: (s) => s.total >= 100,
    rarity: "legendary",
  },
  {
    id: "paid_player",
    label: "Staker",
    description: "Play a paid casual game",
    // Coin / dollar icon path
    icon: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    condition: (s) => s.entries.some((e) => e.mode === "casual"),
    rarity: "rare",
  },
];
