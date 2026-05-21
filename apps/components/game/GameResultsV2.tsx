"use client";

import type { QuestionResult } from './GameEngine';

export interface GameResultsV2Props {
  results: QuestionResult[];
  mode: 'free' | 'paid';
  isPvP?: boolean;
  wagerAmount?: number; // in CELO
  onPlayAgain?: () => void;
  onHome: () => void;
  onRematch?: () => void;
  txHash?: string;
}

/**
 * GameResultsV2 — retro-futuristic results screen
 *
 * Section layout:
 *   ScoreHero        — animated score + verdict
 *   QuestionBreakdown — per-question answer grid
 *   XPGained         — experience points count-up
 *   RewardBreakdown  — fee distribution (paid mode)
 *   ShareButtons     — X / Farcaster share
 *   RematchCTA       — action buttons
 */
export default function GameResultsV2(_props: GameResultsV2Props) {
  // Sections will be composed in feat/results-v2-integrate
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 max-w-4xl mx-auto w-full">
      {/* ScoreHero */}
      <div />
      {/* QuestionBreakdown */}
      <div />
      {/* XPGained */}
      <div />
      {/* RewardBreakdown */}
      <div />
      {/* ShareButtons */}
      <div />
      {/* RematchCTA */}
      <div />
    </div>
  );
}
