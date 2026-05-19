import FadeIn from "./FadeIn";
import { RollingNumber } from "./RollingNumber";

const stats = [
  {
    value: "3",
    label: "Game modes",
    sub: "Free, Paid, PvP",
    accent: "var(--color-accent-free)",
  },
  {
    value: "87%",
    label: "PvP winner payout",
    sub: "Instant on-chain",
    accent: "var(--color-accent-pvp)",
  },
  {
    value: "0.01",
    label: "CELO to play",
    sub: "Paid Casual entry",
    accent: "var(--color-accent-paid)",
  },
  {
    value: "100%",
    label: "On Celo Mainnet",
    sub: "No L2, no bridges",
    accent: "var(--color-primary)",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 border-y border-[var(--color-border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-[var(--color-border-subtle)]">
          {stats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={i * 80}
              className="flex flex-col gap-1 md:px-10 lg:px-14 first:pl-0 last:pr-0"
            >
              <RollingNumber
                value={stat.value}
                className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight"
                style={{ color: stat.accent }}
              />
              <div className="font-semibold text-text-primary text-sm lg:text-base">
                {stat.label}
              </div>
              <div className="text-xs text-text-secondary uppercase tracking-wider">
                {stat.sub}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
