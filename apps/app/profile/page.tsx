"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "../../hooks/useWallet";
import { usePlayerLog } from "../../hooks/usePlayerLog";
import { publicClient } from "../../lib/viem/client";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { UserIcon } from "../../components/icons";
import ProfileLayout from "../../components/profile/ProfileLayout";
import StatsHeader from "../../components/profile/StatsHeader";
import SectionCard from "../../components/profile/SectionCard";
import WinRateDonut from "../../components/profile/WinRateDonut";
import StreakCalendar from "../../components/profile/StreakCalendar";
import CategoryBreakdown from "../../components/profile/CategoryBreakdown";
import NetProfitLoss from "../../components/profile/NetProfitLoss";
import AchievementBadges from "../../components/profile/AchievementBadges";
import BadgeUnlockFlash from "../../components/profile/BadgeUnlockFlash";
import MatchFilters from "../../components/profile/MatchFilters";
import MatchHistory from "../../components/profile/MatchHistory";
import { useMatchFilters } from "../../components/profile/useMatchFilters";
import { type FilterState } from "../../components/profile/MatchFilters";
import { ACHIEVEMENTS, type Achievement } from "../../components/profile/achievements";

export default function ProfilePage() {
  const { address, isConnected, isReady, login, logout } = useWallet();
  const { entries, stats } = usePlayerLog(address);
  const [filters, setFilters] = useState<FilterState>({
    result: "all",
    mode: "all",
    dateRange: "all",
  });
  const filtered = useMatchFilters(entries, filters);

  const [celoBalance, setCeloBalance] = useState<bigint>(0n);
  const [newBadge, setNewBadge] = useState<Achievement | null>(null);
  const [seenBadges, setSeenBadges] = useState<string[]>([]);

  const refreshBalance = useCallback(async () => {
    if (!address) return;
    try {
      const bal = await publicClient.getBalance({ address });
      setCeloBalance(bal);
    } catch {}
  }, [address]);

  useEffect(() => {
    refreshBalance();
    const id = setInterval(refreshBalance, 10_000);
    return () => clearInterval(id);
  }, [refreshBalance]);

  // Detect newly unlocked achievements
  const unlockedIds = ACHIEVEMENTS.filter((a) =>
    a.condition({ total: stats.total, wins: stats.wins, entries }),
  ).map((a) => a.id);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("seenBadges") ?? "[]") as string[];
    setSeenBadges(stored);
    const fresh = unlockedIds.find((id) => !stored.includes(id));
    if (fresh) {
      const badge = ACHIEVEMENTS.find((a) => a.id === fresh) ?? null;
      setNewBadge(badge);
    }
  }, [unlockedIds.join(",")]);

  function dismissBadge() {
    if (!newBadge) return;
    const updated = [...seenBadges, newBadge.id];
    setSeenBadges(updated);
    localStorage.setItem("seenBadges", JSON.stringify(updated));
    setNewBadge(null);
  }

  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pb-20">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-purple-400/20 border-2 border-primary/30 flex items-center justify-center shadow-lg">
          <UserIcon className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-text-primary mb-1">
            Connect Wallet
          </h2>
          <p className="text-text-secondary text-sm font-sans">
            Connect wallet to view your profile
          </p>
        </div>
        <Button onClick={login} size="lg" className="w-full max-w-xs">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 bg-[var(--color-bg-page)] max-w-5xl mx-auto w-full">
      <ProfileLayout
        left={
          <>
            <StatsHeader address={address} celoBalance={celoBalance} stats={stats} />
            <NetProfitLoss netProfitLoss={stats.netProfitLoss} />

            <SectionCard title="Win Rate" className="mt-5">
              <WinRateDonut wins={stats.wins} total={stats.total} />
            </SectionCard>

            <SectionCard title="Activity" className="mt-5">
              <StreakCalendar entries={entries} />
            </SectionCard>

            <SectionCard title="By Mode" className="mt-5">
              <CategoryBreakdown entries={entries} />
            </SectionCard>

            <button
              onClick={logout}
              className="w-full mt-5 py-3 rounded-2xl border border-[var(--color-error)]/30 text-[var(--color-error)] text-sm font-semibold font-sans transition-all hover:bg-[var(--color-error)]/10 hover:border-[var(--color-error)]/60 active:scale-[0.98]"
            >
              Disconnect Wallet
            </button>
          </>
        }
        right={
          <>
            <SectionCard title="Achievements">
              <AchievementBadges achievements={ACHIEVEMENTS} unlockedIds={unlockedIds} />
            </SectionCard>

            <SectionCard title="Match History" className="mt-5">
              <MatchFilters filters={filters} onChange={setFilters} />
              <div className="mt-4">
                <MatchHistory entries={filtered} filters={filters} />
              </div>
            </SectionCard>
          </>
        }
      />

      <BadgeUnlockFlash badge={newBadge} onDone={dismissBadge} />
    </div>
  );
}
