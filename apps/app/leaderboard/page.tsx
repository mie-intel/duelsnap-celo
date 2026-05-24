import type { Metadata } from "next";
import { LeaderboardClient } from "../../components/leaderboard/LeaderboardClient";

export const metadata: Metadata = {
  title: "Leaderboard — DuelSnap",
  description: "Top CELO and cUSD earners on DuelSnap. Compete in on-chain picture duels and climb the global and weekly rankings on Celo Mainnet.",
  openGraph: {
    title: "DuelSnap Leaderboard",
    description: "Top players competing in on-chain picture duels on Celo. See the global and weekly rankings.",
    type: "website",
  },
};

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col flex-1 bg-bg-page">
      <main className="flex-1 px-5 py-8 pb-36 lg:pb-24 lg:py-10 max-w-4xl mx-auto w-full">
        <div className="mb-6">
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

        <LeaderboardClient />
      </main>
    </div>
  );
}
