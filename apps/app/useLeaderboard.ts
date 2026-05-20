"use client";

import { useCallback, useEffect, useState } from "react";
import type { LeaderboardEntry } from "../components/leaderboard/LeaderboardRow";

type Tab = "global" | "weekly";

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  tab: Tab;
  setTab: (tab: Tab) => void;
  refresh: () => void;
}

interface ApiEntry {
  address: string;
  wins: number;
  losses: number;
  totalCelo: number;
}

function attachRankAndChange(entries: ApiEntry[]): LeaderboardEntry[] {
  return entries.map((e, i) => ({
    ...e,
    rank: i + 1,
    change: 0, // extended in future PR (RankChangeIndicator)
  }));
}

export function useLeaderboard(currentAddress?: string): UseLeaderboardResult {
  const [tab, setTab] = useState<Tab>("global");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/leaderboard?tab=${tab}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { entries: ApiEntry[] }) => {
        if (cancelled) return;
        const ranked = attachRankAndChange(data.entries).map((e) => ({
          ...e,
          isCurrentUser:
            currentAddress?.toLowerCase() === e.address.toLowerCase(),
        }));
        setEntries(ranked);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message ?? "Failed to load leaderboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, currentAddress, tick]);

  return { entries, loading, error, tab, setTab, refresh };
}
