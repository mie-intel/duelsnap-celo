import Link from "next/link";
import FadeIn from "./FadeIn";

export default function CTASection() {
  return (
    <section id="play" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-bg-card px-10 py-16 md:px-20 md:py-24 lg:px-28 lg:py-32 text-center">
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-20 left-1/3 w-80 h-80 rounded-full bg-[var(--color-glow-green)] blur-[80px]" />
            <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-[var(--color-glow-gold)] blur-[80px]" />
          </div>

          <FadeIn className="relative flex flex-col items-center gap-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border-mid)] bg-[var(--color-surface-1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-text-secondary tracking-widest uppercase">
                Live now
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-text-primary tracking-tighter leading-[0.95]">
              Your first duel is free.
              <br />
              <span className="text-primary">Start in 10 seconds.</span>
            </h2>

            <p className="text-text-secondary text-base leading-relaxed max-w-[48ch]">
              No signup. No deposit. Open Free Casual and start guessing. Add a wallet
              when you're ready to compete for real CELO.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/play"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-text-inverse font-bold text-base hover:bg-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card min-h-[52px]"
              >
                Play Free Now
              </Link>
              <Link
                href="/pvp/lobby"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[var(--color-border-mid)] bg-[var(--color-surface-1)] text-text-primary font-semibold text-base hover:bg-[var(--color-surface-2)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card min-h-[52px]"
              >
                Enter PvP Arena
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
