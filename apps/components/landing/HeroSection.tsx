import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background glow effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-glow-green)] blur-[120px] opacity-60" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--color-glow-gold)] blur-[100px] opacity-40" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] -translate-x-1/2 rounded-full bg-[var(--color-glow-red)] blur-[120px] opacity-20" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="hero-fade-1"><HeroEyebrow /></div>
            <div className="hero-fade-2"><HeroHeadline /></div>
            <div className="hero-fade-3"><HeroSubtitle /></div>
            <div className="hero-fade-4"><HeroCTA /></div>
            <div className="hero-fade-5"><HeroStats /></div>
          </div>

          {/* Right: Visual */}
          <div className="hero-fade-3"><HeroVisual /></div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 hero-fade-5">
        <span className="text-xs text-text-secondary uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-text-secondary/40 to-transparent" />
      </div>
    </section>
  );
}

function HeroEyebrow() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border-mid)] bg-[var(--color-surface-1)] w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      <span className="text-xs font-medium text-text-secondary tracking-widest uppercase">
        Live on Celo Mainnet
      </span>
    </div>
  );
}

function HeroHeadline() {
  return (
    <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[0.95] tracking-tighter">
      Guess the{" "}
      <span className="relative inline-block">
        <span className="text-primary">Picture.</span>
      </span>
      <br />
      <span className="text-text-secondary font-semibold text-4xl md:text-5xl lg:text-6xl">
        Win Real
      </span>{" "}
      <span className="text-secondary">CELO.</span>
    </h1>
  );
}

function HeroSubtitle() {
  return (
    <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-[52ch]">
      Picture duels on the blockchain. Snap, guess, earn. Play free anytime,
      wager CELO in PvP ranked matches, or contribute photos and collect royalties forever.
    </p>
  );
}

function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/play"
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-text-inverse font-bold text-base hover:bg-primary-dark transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page min-h-[48px]"
      >
        Start Playing Free
      </Link>
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
    { value: "3", label: "Game modes" },
    { value: "87%", label: "Winner payout" },
    { value: "0.01", label: "CELO to play" },
  ];

  return (
    <div className="flex items-center gap-6 pt-2">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-6">
          <div>
            <div className="font-display font-bold text-2xl text-text-primary tabular-nums">
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
  return (
    <div className="relative flex items-center justify-center md:justify-end">
      <div className="relative w-full max-w-sm md:max-w-none">
        {/* Glow behind card */}
        <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-3xl scale-95" />

        {/* Mock game card */}
        <div className="relative bg-bg-card border border-[var(--color-border-subtle)] rounded-[2rem] p-6 shadow-2xl">
          <div className="text-xs font-medium text-text-secondary uppercase tracking-widest mb-3">
            Round 3 of 5 · PvP Ranked
          </div>
          <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-[var(--color-surface-1)]">
            <Image
              src="https://picsum.photos/seed/duelsnap-hero/400/300"
              alt="Game preview"
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-text-secondary text-sm mb-3">
            What landmark is this?
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["Eiffel Tower", "Tokyo Tower", "Big Ben", "Burj Khalifa"].map(
              (opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    i === 0
                      ? "bg-primary/20 border border-primary text-primary"
                      : "bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] text-text-secondary hover:bg-[var(--color-surface-2)]"
                  }`}
                >
                  {opt}
                </button>
              )
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>Wager: 0.1 CELO</span>
            <span className="text-primary font-semibold">You're winning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
