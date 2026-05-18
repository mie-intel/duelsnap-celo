import Link from "next/link";

const modes = [
  {
    id: "free",
    label: "FREE",
    name: "Free Casual",
    tagline: "No stakes, pure fun",
    body: "5 questions per round. Up to 3 rounds per day. No wallet, no deposit — just play.",
    detail: ["5 questions / round", "3 free rounds daily", "No wallet needed"],
    href: "/play",
    accent: "var(--color-accent-free)",
    accentLight: "var(--color-accent-free-light)",
    badge: "FREE",
    colSpan: "md:col-span-1",
  },
  {
    id: "paid",
    label: "EARN",
    name: "Paid Casual",
    tagline: "Play to earn royalties",
    body: "Pay 0.01 CELO per session. Top scorers earn royalties from a shared pool. Contributors get paid every time their photo is used.",
    detail: ["0.01 CELO entry", "10 questions / session", "Royalty payouts on-chain"],
    href: "/play",
    accent: "var(--color-accent-paid)",
    accentLight: "var(--color-accent-paid-light)",
    badge: "0.01 CELO",
    colSpan: "md:col-span-1",
  },
  {
    id: "pvp",
    label: "RANKED",
    name: "PvP Ranked",
    tagline: "1v1 wager battles",
    body: "Challenge another player. Stake 0.1 CELO each. Winner takes 87% of the pot, protocol keeps 13% for contributors and treasury.",
    detail: ["0.1 CELO wager", "10 questions, 1v1", "Winner takes 87%"],
    href: "/pvp/lobby",
    accent: "var(--color-accent-pvp)",
    accentLight: "var(--color-accent-pvp-light)",
    badge: "0.1 CELO",
    colSpan: "md:col-span-1",
  },
];

export default function GameModesSection() {
  return (
    <section id="game-modes" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-16 md:mb-20">
          <p className="text-xs font-medium text-secondary uppercase tracking-widest mb-3">
            Game Modes
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-text-primary tracking-tight leading-tight max-w-[22ch]">
            Free, earn, or go all-in on PvP
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {modes.map((mode) => (
            <Link
              key={mode.id}
              href={mode.href}
              className={`group relative flex flex-col gap-6 p-8 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] hover:border-[var(--color-border-mid)] hover:bg-[var(--color-surface-2)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${mode.colSpan}`}
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{
                    color: mode.accent,
                    backgroundColor: mode.accentLight,
                  }}
                >
                  {mode.badge}
                </span>
                <span
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: mode.accent }}
                >
                  {mode.label}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-2xl text-text-primary tracking-tight">
                  {mode.name}
                </h3>
                <p className="text-sm font-medium" style={{ color: mode.accent }}>
                  {mode.tagline}
                </p>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                {mode.body}
              </p>

              <ul className="flex flex-col gap-1.5 pt-2 border-t border-[var(--color-border-subtle)]">
                {mode.detail.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-xs text-text-secondary"
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: mode.accent }}
                    />
                    {d}
                  </li>
                ))}
              </ul>

              <div
                className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-150"
                style={{ color: mode.accent }}
              >
                Play now
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
