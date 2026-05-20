import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — DuelSnap",
  description: "Top CELO earners on DuelSnap. Compete and climb the ranks.",
};

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col flex-1 bg-bg-page">
      <main className="flex-1 px-5 py-8 pb-24 lg:py-10 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Rankings
          </p>
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-text-primary">
            Leaderboard
          </h1>
          <p className="text-text-secondary text-sm mt-1 font-sans">
            Top players by CELO earned. Updated after every game.
          </p>
        </div>

        {/* Content slots — filled by subsequent PRs */}
        <div className="space-y-4">
          <div className="h-40 rounded-[2rem] bg-surface-1 border border-border-subtle animate-pulse" />
          <div className="h-96 rounded-[2rem] bg-surface-1 border border-border-subtle animate-pulse" />
        </div>
      </main>
    </div>
  );
}
