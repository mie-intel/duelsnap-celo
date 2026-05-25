/**
 * Game domain types for DuelSnap.
 */

// ─── Questions ────────────────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  /** IPFS CID or URL of category icon */
  imageUrl?: string;
}

export interface Question {
  /** On-chain question ID */
  id: bigint;
  /** Question text or IPFS CID for image */
  content: string;
  /** Whether content is image (IPFS) or text */
  contentType: "text" | "image";
  /** 2–4 answer choices */
  answers: string[];
  /** Index of correct answer (0-based) */
  correctIndex: number;
  category: Category;
  difficulty: Difficulty;
  /** Creator address */
  contributor: `0x${string}`;
}

// ─── Game Session ─────────────────────────────────────────────────────────────

export type GameMode = "casual" | "ranked";

export type GameStatus =
  | "idle"
  | "starting"
  | "in_progress"
  | "finished"
  | "abandoned";

export interface PlayerAnswer {
  questionId: bigint;
  /** Selected answer index, or null if timed out */
  selectedIndex: number | null;
  /** Time taken to answer in ms */
  elapsedMs: number;
  correct: boolean;
  score: number;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  status: GameStatus;
  questions: Question[];
  answers: PlayerAnswer[];
  startedAt: number;
  endedAt?: number;
}

// ─── Results ─────────────────────────────────────────────────────────────────

export interface GameResult {
  session: GameSession;
  totalScore: number;
  correctCount: number;
  accuracy: number;
  xpEarned: number;
  /** Present in ranked mode */
  opponentResult?: OpponentResult;
}

export interface OpponentResult {
  address: `0x${string}`;
  displayName?: string;
  totalScore: number;
  correctCount: number;
}

// ─── Matchmaking ─────────────────────────────────────────────────────────────

export type MatchmakingStatus =
  | "idle"
  | "searching"
  | "found"
  | "starting"
  | "timeout"
  | "cancelled";

export interface MatchmakingState {
  status: MatchmakingStatus;
  matchId?: string;
  opponentAddress?: `0x${string}`;
  wagerWei: bigint;
  searchStartedAt?: number;
}

// ─── Ranked Match ─────────────────────────────────────────────────────────────

export type MatchOutcome = "win" | "loss" | "draw";

export interface RankedMatch {
  matchId: string;
  playerA: `0x${string}`;
  playerB: `0x${string}`;
  wagerWei: bigint;
  outcome?: MatchOutcome;
  settledAt?: number;
  txHash?: `0x${string}`;
}
