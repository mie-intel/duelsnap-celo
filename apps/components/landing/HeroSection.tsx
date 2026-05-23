import Link from "next/link";
import Image from "next/image";
import { HeroReveal, FloatingCard, AnimatedTimerBar, GlowOrbs, MagneticButton } from "./HeroAnimated";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-dot-grid">
      {/* Animated glow orbs */}
      <GlowOrbs />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 w-full pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 xl:pt-48 xl:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[55fr_45fr] xl:grid-cols-[58fr_42fr] gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            <HeroReveal index={0}><HeroEyebrow /></HeroReveal>
            <HeroReveal index={1}><HeroHeadline /></HeroReveal>
            <HeroReveal index={2}><HeroSubtitle /></HeroReveal>
            <HeroReveal index={3}><HeroCTA /></HeroReveal>
            <HeroReveal index={4}><HeroStats /></HeroReveal>
          </div>

          {/* Right: Floating visual */}
          <div className="flex justify-center md:justify-end">
            <FloatingCard>
              <HeroVisual />
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 hero-fade-5 animate-scroll-bounce">
        <span className="text-xs text-text-secondary uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-text-secondary/40 to-transparent" />
      </div>
    </section>
  );
}

function HeroEyebrow() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border-mid)] bg-[var(--color-surface-1)] w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-medium text-text-secondary tracking-widest uppercase">
          Live on Celo Mainnet
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border-subtle)] bg-transparent w-fit">
        <span className="text-xs font-medium text-text-secondary">
          No signup · No deposit · Open source
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] w-fit">
        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-primary" aria-hidden="true">
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5.5 8a2.5 2.5 0 005 0 2.5 2.5 0 00-5 0z" fill="currentColor" />
        </svg>
        <span className="text-xs font-medium text-text-secondary">MiniPay compatible</span>
      </div>
    </div>
  );
}

function HeroHeadline() {
  return (
    <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[7rem] 2xl:text-[8rem] text-text-primary leading-[0.93] tracking-tighter">
      Guess the{" "}
      <span className="text-primary">Picture.</span>
      <br />
      <span className="text-text-secondary font-semibold text-4xl md:text-5xl lg:text-[4.25rem] xl:text-[5.5rem] 2xl:text-[6.5rem]">
        Win Real{" "}
      </span>
      <span className="text-secondary text-4xl md:text-5xl lg:text-[4.25rem] xl:text-[5.5rem] 2xl:text-[6.5rem]">CELO.</span>
    </h1>
  );
}

function HeroSubtitle() {
  return (
    <p className="text-text-secondary text-base md:text-lg lg:text-xl leading-relaxed max-w-[52ch]">
      Picture duels on the blockchain. Snap, guess, earn. Play free anytime,
      wager CELO in PvP ranked matches, or contribute photos and collect royalties forever.
    </p>
  );
}

function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <MagneticButton
        href="/play"
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-text-inverse font-bold text-base hover:bg-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page min-h-[48px]"
      >
        Start Playing Free
        <span aria-hidden className="ml-0.5">→</span>
      </MagneticButton>
      <Link
        href="/pvp/lobby"
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[var(--color-border-mid)] bg-[var(--color-surface-1)] text-text-primary font-semibold text-base hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border-mid)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page min-h-[48px]"
      >
        Enter PvP Arena
      </Link>
    </div>
  );
}

function HeroStats() {
  const stats = [
    { value: "3", label: "Game modes", accent: "var(--color-primary)" },
    { value: "87%", label: "Winner payout", accent: "var(--color-accent-pvp)" },
    { value: "0.01", label: "CELO to play", accent: "var(--color-secondary)" },
  ];

  return (
    <div className="flex items-center gap-6 pt-2">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-6">
          <div>
            <div className="font-display font-bold text-2xl lg:text-3xl tabular-nums" style={{ color: stat.accent }}>
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div className="w-px h-8 bg-[var(--color-border-subtle)]" />
          )}
        </div>
      ))}
    </div>
  );
}

function HeroVisual() {
  const options = ["Eiffel Tower", "Tokyo Tower", "Big Ben", "Burj Khalifa"];

  return (
    <div className="relative w-full max-w-[440px] md:max-w-none">
      <div className="relative w-full">
        {/* Outer glow */}
        <div className="absolute -inset-4 bg-primary/8 rounded-[3rem] blur-3xl" />

        {/* Mock game card */}
        <div className="relative bg-bg-card border border-[var(--color-border-subtle)] rounded-[2rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] lg:shadow-[0_48px_96px_rgba(0,0,0,0.6),0_0_0_1px_rgba(53,208,127,0.08)]">
          {/* Card header */}
          <div className="px-5 pt-4 pb-3 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">
                Round 3 / 5
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-pvp/15 text-accent-pvp">
                PvP Ranked
              </span>
            </div>
            {/* Animated timer bar */}
            <div className="h-1 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
              <AnimatedTimerBar />
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[16/10] bg-[var(--color-surface-1)]">
            <Image
              src="https://picsum.photos/seed/duelsnap-landmark/600/375"
              alt="Game question preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card/60 to-transparent" />
          </div>

          {/* Question */}
          <div className="px-5 pt-4 pb-3">
            <p className="text-text-primary font-semibold text-sm mb-3">
              Which landmark is this?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[40px] ${
                    i === 0
                      ? "bg-primary/20 border border-primary/60 text-primary"
                      : "bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] text-text-secondary"
                  }`}
                >
                  {i === 0 && <span className="mr-1 opacity-70">✓</span>}
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Card footer */}
          <div className="px-5 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-text-secondary">
                Wager: <span className="text-secondary font-semibold">0.1 CELO</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary font-semibold">You: 6</span>
                <span className="text-xs text-text-secondary mx-0.5">vs</span>
                <span className="text-xs text-text-secondary font-semibold">Rival: 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
