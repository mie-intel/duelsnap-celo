/**
 * Leaderboard domain types.
 */

export type LeaderboardPeriod = "all-time" | "weekly" | "daily";

export type LeaderboardSortField = "xp" | "wins" | "score" | "accuracy";

export interface LeaderboardEntry {
  rank: number;
  address: `0x${string}`;
  displayName?: string;
  /** Avatar IPFS CID or URL */
  avatarUrl?: string;
  xp: number;
  wins: number;
  losses: number;
  totalGames: number;
  /** 0–100 */
  accuracy: number;
  highScore: number;
  /** CELO earned total (wei) */
  totalEarnedWei: bigint;
  /** Rank change since last period (+N, -N, 0 = unchanged, null = new) */
  rankChange: number | null;
}

export interface LeaderboardPage {
  entries: LeaderboardEntry[];
  period: LeaderboardPeriod;
  total: number;
  updatedAt: number;
}

export interface PlayerStats {
  address: `0x${string}`;
  xp: number;
  rank: number;
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
  accuracy: number;
  highScore: number;
  currentStreak: number;
  bestStreak: number;
  totalEarnedWei: bigint;
}
