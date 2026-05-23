'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import TimerBar from './TimerBar';
import GameResults from './GameResults';
import GameResultsV2 from './GameResultsV2';
import Spinner from '../ui/Spinner';

export interface Question {
  id: number;
  imageUrl: string;
}

export interface QuestionResult {
  id: number;
  imageUrl: string;
  correct: boolean;
  guess: string;
}

interface GameEngineProps {
  questions: Question[];
  secondsPerQuestion: number;
  mode: 'free' | 'paid';
  onComplete: (results: QuestionResult[]) => void;
  onHome: () => void;
  onPlayAgain?: () => void;
}

export default function GameEngine({
  questions, secondsPerQuestion, mode, onComplete, onHome, onPlayAgain,
}: GameEngineProps) {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [checking, setChecking] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);
  const resultsRef = useRef<QuestionResult[]>([]);

  // Preload all question images up front
  useEffect(() => {
    questions.forEach((q) => {
      const img = new window.Image();
      img.src = q.imageUrl;
    });
  }, [questions]);

  const currentQ = questions[index];

  const submitAnswer = useCallback(async (guessValue: string) => {
    if (checking || completedRef.current) return;
    setChecking(true);

    let correct = false;
    try {
      const res = await fetch('/api/game/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: currentQ.id, guess: guessValue.trim() }),
      });
      const data = await res.json();
      correct = data.correct ?? false;
    } catch {
      correct = false;
    }

    const result: QuestionResult = {
      id: currentQ.id,
      imageUrl: currentQ.imageUrl,
      correct,
      guess: guessValue.trim().toUpperCase(),
    };

    const next = [...resultsRef.current, result];
    resultsRef.current = next;
    setResults(next);

    if (next.length === questions.length) {
      completedRef.current = true;
      setDone(true);
      onComplete(next);
    }

    setGuess('');
    setChecking(false);
    setTimerKey((k) => k + 1);
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  }, [checking, currentQ, questions.length, onComplete]);

  const handleExpire = useCallback(() => {
    submitAnswer('');
  }, [submitAnswer]);

  if (done) {
    // GameResults kept as reference (unused — replaced by GameResultsV2)
    void GameResults;
    return (
      <GameResultsV2
        results={results}
        mode={mode}
        onHome={onHome}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  if (!currentQ) {
    return <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="flex flex-col flex-1 px-5 py-4 gap-4 bg-bg-page max-w-4xl mx-auto w-full">
      {/* Chain indicator row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-text-secondary/30 uppercase tracking-widest">
          Question {index + 1}/{questions.length}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono text-text-secondary/30 uppercase tracking-widest">
            Celo · {mode === 'paid' ? '0.01 CELO' : 'Free'}
          </span>
        </span>
      </div>
      <TimerBar
        durationMs={secondsPerQuestion * 1000}
        onExpire={handleExpire}
        resetKey={timerKey}
      />
      <QuestionCard
        imageUrl={currentQ.imageUrl}
        questionNum={index + 1}
        totalQuestions={questions.length}
        value={guess}
        onChange={setGuess}
        onSubmit={() => submitAnswer(guess)}
        disabled={checking}
      />
    </div>
  );
}
