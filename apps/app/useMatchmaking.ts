"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MatchState =
  | "idle"
  | "searching"
  | "found"
  | "countdown"
  | "connection_lost";

export interface OpponentInfo {
  address: string;
  wins: number;
  losses: number;
  winRate: number;
}

export interface MatchmakingState {
  state: MatchState;
  wager: number;
  opponent: OpponentInfo | null;
  elapsed: number; // seconds searching
  countdown: number; // 3 → 0
  startSearch: (wager: number) => void;
  cancel: () => void;
  retry: () => void;
}

const MOCK_OPPONENTS: OpponentInfo[] = [
  { address: "0xf3A2...8b1C", wins: 34, losses: 18, winRate: 65 },
  { address: "0x7c91...D4e0", wins: 12, losses: 9, winRate: 57 },
  { address: "0xa84F...3310", wins: 88, losses: 41, winRate: 68 },
  { address: "0x2E6b...cc72", wins: 5, losses: 7, winRate: 42 },
];

function randomOpponent(): OpponentInfo {
  return MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
}

function randomSearchDelay(): number {
  return 3000 + Math.random() * 5000; // 3–8s
}

export function useMatchmaking(): MatchmakingState {
  const [state, setState] = useState<MatchState>("idle");
  const [wager, setWager] = useState(0.1);
  const [opponent, setOpponent] = useState<OpponentInfo | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSearch = useCallback(
    (selectedWager: number) => {
      clearAll();
      setWager(selectedWager);
      setElapsed(0);
      setOpponent(null);
      setCountdown(3);
      setState("searching");

      // Elapsed timer
      intervalRef.current = setInterval(
        () => setElapsed((e) => e + 1),
        1000,
      );

      // Simulate finding opponent
      const searchDelay = randomSearchDelay();
      const foundTimer = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Timeout if > 30s
        if (searchDelay > 30000) {
          setState("connection_lost");
          return;
        }

        setOpponent(randomOpponent());
        setState("found");

        // Auto-advance to countdown after 2s
        const countdownTimer = setTimeout(() => {
          setState("countdown");
          setCountdown(3);

          let tick = 3;
          const cdInterval = setInterval(() => {
            tick -= 1;
            setCountdown(tick);
            if (tick <= 0) {
              clearInterval(cdInterval);
              // Game would start here — reset to idle for demo
              setTimeout(() => {
                setState("idle");
                setOpponent(null);
              }, 800);
            }
          }, 1000);
          timersRef.current.push(cdInterval as unknown as ReturnType<typeof setTimeout>);
        }, 2000);
        timersRef.current.push(countdownTimer);
      }, searchDelay);
      timersRef.current.push(foundTimer);

      // Hard timeout at 30s
      const timeoutTimer = setTimeout(() => {
        clearAll();
        setState("connection_lost");
      }, 30000);
      timersRef.current.push(timeoutTimer);
    },
    [clearAll],
  );

  const cancel = useCallback(() => {
    clearAll();
    setState("idle");
    setOpponent(null);
    setElapsed(0);
  }, [clearAll]);

  const retry = useCallback(() => {
    cancel();
  }, [cancel]);

  useEffect(() => () => clearAll(), [clearAll]);

  return { state, wager, opponent, elapsed, countdown, startSearch, cancel, retry };
}
