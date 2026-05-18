import FadeIn from "./FadeIn";

export default function EarnSection() {
  const streams = [
    {
      title: "Win PvP Wagers",
      amount: "0.087 CELO",
      description: "Beat your opponent in a ranked duel and collect 87% of the 0.2 CELO wager pool instantly.",
      accent: "var(--color-accent-pvp)",
      from: "per win",
    },
    {
      title: "Photo Royalties",
      amount: "Forever",
      description: "Submit an image. Once it passes AI verification and gets played in Paid Casual, you earn a royalty cut every single time. Permanently.",
      accent: "var(--color-accent-free)",
      from: "passive income",
    },
    {
      title: "Paid Casual Leaderboard",
      amount: "Top 10%",
      description: "High-score players in Paid Casual sessions share a portion of the session pool. Accuracy pays.",
      accent: "var(--color-accent-paid)",
      from: "per session",
    },
  ];

  return (
    <section id="earn" className="py-24 md:py-32 lg:py-40 bg-[var(--color-surface-1)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 lg:gap-32 items-start">
          {/* Left: copy */}
          <FadeIn className="flex flex-col gap-6 md:sticky md:top-32">
            <p className="text-xs font-medium text-primary uppercase tracking-widest">
              Earn
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-text-primary tracking-tight leading-tight">
              Multiple ways to make CELO
            </h2>
            <p className="text-text-secondary text-base leading-relaxed max-w-[50ch]">
              DuelSnap isn't just a game — it's an economic layer. Play,
              contribute, and win to build an on-chain income stream.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <a
                href="/contribute"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-150"
              >
                Start contributing photos
                <span aria-hidden>→</span>
              </a>
              <a
                href="/pvp/lobby"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent-pvp hover:opacity-75 transition-opacity duration-150"
              >
                Enter PvP Arena
                <span aria-hidden>→</span>
              </a>
            </div>
          </FadeIn>

          {/* Right: earn streams */}
          <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
            {streams.map((stream, i) => (
              <FadeIn key={stream.title} delay={i * 80}>
              <div className="py-8 first:pt-0 last:pb-0 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display font-bold text-xl lg:text-2xl text-text-primary tracking-tight">
                    {stream.title}
                  </h3>
                  <div className="text-right flex-shrink-0">
                    <div
                      className="font-display font-bold text-xl lg:text-2xl tabular-nums"
                      style={{ color: stream.accent }}
                    >
                      {stream.amount}
                    </div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider">
                      {stream.from}
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[55ch]">
                  {stream.description}
                </p>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
