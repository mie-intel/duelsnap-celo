"use client";

import { useWallet } from "../../hooks/useWallet";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { PodiumSection } from "./PodiumSection";
import { LeaderboardTabs } from "./LeaderboardTabs";
import { LeaderboardList } from "./LeaderboardList";
import { LeaderboardSkeleton } from "./LeaderboardSkeleton";
import { LeaderboardEmpty, LeaderboardError } from "./LeaderboardEmpty";
import { PlayerHighlightRow } from "./PlayerHighlightRow";

export function LeaderboardClient() {
  const { address } = useWallet();
  const { entries, loading, error, tab, setTab, refresh } = useLeaderboard(address ?? undefined);

  const top3 = entries.slice(0, 3);
  const currentUser = entries.find((e) => e.isCurrentUser) ?? null;

  return (
    <>
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-6 lg:items-start">
        {/* Left: main leaderboard */}
        <div>
          <LeaderboardTabs active={tab} onChange={setTab} />

          {loading ? (
            <LeaderboardSkeleton count={10} />
          ) : error ? (
            <LeaderboardError message={error} onRetry={refresh} />
          ) : entries.length === 0 ? (
            <LeaderboardEmpty tab={tab} />
          ) : (
            <>
              <PodiumSection top3={top3} />
              <LeaderboardList entries={entries} startFrom={3} />
            </>
          )}
        </div>

        {/* Right: stats sidebar — desktop only */}
        <aside className="hidden lg:block sticky top-6 space-y-4">
          <div className="rounded-[2rem] border border-border-subtle bg-surface-1 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
              Your Stats
            </p>
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm font-sans">Rank</span>
                  <span className="font-display font-bold text-text-primary">
                    #{currentUser.rank}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm font-sans">Wins</span>
                  <span className="font-display font-bold text-primary">
                    {currentUser.wins}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm font-sans">Losses</span>
                  <span className="font-display font-bold text-error">
                    {currentUser.losses}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm font-sans">CELO Earned</span>
                  <span className="font-mono font-bold text-secondary text-sm">
                    {(currentUser.totalCelo / 1e18).toFixed(4)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-text-secondary text-sm font-sans">
                Connect wallet to see your stats.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-border-subtle bg-surface-1 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary/60 mb-3">
              {entries.length} Players
            </p>
            <p className="text-text-secondary text-xs font-sans leading-relaxed">
              Rankings update after each completed duel. Play more to climb.
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky current user row — mobile */}
      <PlayerHighlightRow entry={currentUser} totalEntries={entries.length} />
    </>
  );
}
