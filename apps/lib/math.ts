/**
 * Math and stats utilities for scoring and game calculations.
 */

import { BASE_CORRECT_SCORE, MAX_TIME_BONUS, QUESTION_TIMEOUT_MS } from "./constants";

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Calculate question score based on correctness and time taken.
 * Fast correct answer → close to BASE + MAX_TIME_BONUS.
 * Slow correct answer → close to BASE.
 * Wrong answer → 0.
 *
 * @param correct Whether the answer was correct
 * @param elapsedMs Time taken to answer (ms)
 * @returns Score for this question
 */
export function calcQuestionScore(correct: boolean, elapsedMs: number): number {
  if (!correct) return 0;
  const ratio = Math.max(0, 1 - elapsedMs / QUESTION_TIMEOUT_MS);
  const timeBonus = Math.round(MAX_TIME_BONUS * ratio);
  return BASE_CORRECT_SCORE + timeBonus;
}

/**
 * Sum array of question scores.
 */
export function calcTotalScore(scores: number[]): number {
  return scores.reduce((sum, s) => sum + s, 0);
}

/**
 * Calculate accuracy percentage from correct/total.
 */
export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * XP earned from a game session.
 *
 * @param correctCount Correct answers
 * @param won Whether the player won the duel
 * @param perfect Whether the player got all answers correct
 */
export function calcXpEarned(
  correctCount: number,
  won: boolean,
  perfect: boolean,
): number {
  const base = correctCount * 10;
  const winBonus = won ? 50 : 0;
  const perfectBonus = perfect ? 100 : 0;
  return base + winBonus + perfectBonus;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

/**
 * Compute mean of an array.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Compute median of an array.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between a and b by t (0–1).
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Normalize value to 0–1 range.
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}
