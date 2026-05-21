"use client";

import { useMemo } from "react";
import type { GameLogEntry } from "../../hooks/usePlayerLog";
import type { FilterState } from "./MatchFilters";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export function useMatchFilters(
  entries: GameLogEntry[],
  filters: FilterState,
): GameLogEntry[] {
  return useMemo(() => {
    let filtered = [...entries];

    // Result filter
    if (filters.result !== "all") {
      filtered = filtered.filter((e) => e.result === filters.result);
    }

    // Mode filter
    if (filters.mode !== "all") {
      filtered = filtered.filter((e) => e.mode === filters.mode);
    }

    // Date range filter
    if (filters.dateRange === "week") {
      const cutoff = Date.now() - WEEK_MS;
      filtered = filtered.filter((e) => e.timestamp >= cutoff);
    } else if (filters.dateRange === "month") {
      const cutoff = Date.now() - MONTH_MS;
      filtered = filtered.filter((e) => e.timestamp >= cutoff);
    }

    // Sort most recent first
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    return filtered;
  }, [entries, filters.result, filters.mode, filters.dateRange]);
}
