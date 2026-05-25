/**
 * DuelSnap game constants and configuration.
 * Single source of truth for magic numbers used across the app.
 */

// ─── Game Rules ───────────────────────────────────────────────────────────────

/** Number of questions per game session */
export const QUESTIONS_PER_GAME = 10;

/** Time limit per question in seconds */
export const QUESTION_TIME_LIMIT_SECONDS = 30;

/** Total game duration in seconds (questions × time per question) */
export const GAME_DURATION_SECONDS =
  QUESTIONS_PER_GAME * QUESTION_TIME_LIMIT_SECONDS;

/** Number of answer options per question */
export const ANSWER_OPTIONS_COUNT = 4;

/** Seconds of grace period after time expires before auto-submit */
export const ANSWER_GRACE_PERIOD_SECONDS = 2;

// ─── Stake / Economy ──────────────────────────────────────────────────────────

/** Minimum stake in cUSD (human-readable, not wei) */
export const MIN_STAKE_CUSD = 0.01;

/** Maximum stake in cUSD (human-readable, not wei) */
export const MAX_STAKE_CUSD = 100;

/** Default/suggested stake for new players */
export const DEFAULT_STAKE_CUSD = 0.1;

/** Platform fee percentage (0–1). e.g. 0.05 = 5% */
export const PLATFORM_FEE_PCT = 0.05;

/** cUSD ERC-20 contract address on Celo mainnet */
export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;

// ─── Matchmaking ──────────────────────────────────────────────────────────────

/** How often to poll matchmaking queue status (ms) */
export const MATCHMAKING_POLL_INTERVAL_MS = 3_000;

/** Max time to wait in queue before auto-cancel (ms) */
export const MATCHMAKING_TIMEOUT_MS = 120_000;

// ─── Leaderboard ─────────────────────────────────────────────────────────────

/** Number of entries per leaderboard page */
export const LEADERBOARD_PAGE_SIZE = 50;

/** How often to auto-refresh leaderboard (ms). 0 = disabled */
export const LEADERBOARD_REFRESH_INTERVAL_MS = 30_000;

// ─── Rank Tiers ───────────────────────────────────────────────────────────────

export const RANK_TIERS = [
  { label: "Bronze", minScore: 0, color: "#cd7f32" },
  { label: "Silver", minScore: 100, color: "#a8a8a8" },
  { label: "Gold", minScore: 500, color: "#fbbf24" },
  { label: "Platinum", minScore: 1_500, color: "#67e8f9" },
  { label: "Diamond", minScore: 5_000, color: "#a78bfa" },
] as const;

export type RankTier = (typeof RANK_TIERS)[number]["label"];

/** Get rank tier for a given score */
export function getRankTier(score: number): (typeof RANK_TIERS)[number] {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (score >= RANK_TIERS[i].minScore) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
}

// ─── UI Timings ───────────────────────────────────────────────────────────────

/** Delay before showing the next question after answer (ms) */
export const NEXT_QUESTION_DELAY_MS = 1_500;

/** Duration of result celebration animation (ms) */
export const RESULT_ANIMATION_DURATION_MS = 2_500;

/** Copy-to-clipboard feedback reset delay (ms) */
export const COPY_FEEDBACK_DELAY_MS = 2_000;

// ─── External Links ───────────────────────────────────────────────────────────

export const LINKS = {
  celo: "https://celo.org",
  celoscan: "https://celoscan.io",
  twitter: "https://twitter.com/duelsnap",
  docs: "https://docs.duelsnap.xyz",
} as const;
