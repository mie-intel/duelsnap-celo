"use client";

import type { QuestionResult } from './GameEngine';
import ScoreHero from './results/ScoreHero';
import QuestionBreakdown from './results/QuestionBreakdown';
import XPGained from './results/XPGained';
import RewardBreakdown from './results/RewardBreakdown';
import { ShareButtons } from './results/ShareButtons';
import RematchCTA from './results/RematchCTA';

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

export default function GameResultsV2({
  results,
  mode,
  wagerAmount,
  onPlayAgain,
  onHome,
  onRematch,
  txHash,
}: GameResultsV2Props) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 max-w-4xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        {/* Left column: score + extras + actions */}
        <div className="flex flex-col gap-4 lg:w-72 lg:shrink-0">
          <ScoreHero correct={correct} total={total} />
          <XPGained correct={correct} total={total} mode={mode} />
          <RewardBreakdown mode={mode} wagerAmount={wagerAmount} txHash={txHash} />
          <ShareButtons correct={correct} total={total} mode={mode} />
          <RematchCTA
            onRematch={onRematch}
            onPlayAgain={onPlayAgain}
            onHome={onHome}
            mode={mode}
          />
        </div>

        {/* Right column: question breakdown */}
        <div className="flex-1 min-w-0">
          <QuestionBreakdown results={results} />
        </div>
      </div>
    </div>
  );
}
