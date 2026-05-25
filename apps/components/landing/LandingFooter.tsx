import Link from "next/link";
import Image from "next/image";

const celoEcosystemLinks = [
  { label: "Celo Blockscout", href: "https://celo.blockscout.com" },
  { label: "Opera MiniPay", href: "https://www.opera.com/mobile/mini" },
  { label: "Celo Docs", href: "https://docs.celo.org" },
  { label: "Mento Protocol", href: "https://mento.org" },
];

const appLinks = [
  { label: "Play Free", href: "/play" },
  { label: "PvP Arena", href: "/pvp/lobby" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Contribute", href: "/contribute" },
  { label: "Activity", href: "/activity" },
];

const sectionLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Game Modes", href: "#game-modes" },
  { label: "Earn", href: "#earn" },
  { label: "Contribute", href: "#contribute" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="DuelSnap"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                DuelSnap
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[28ch]">
              Picture duels on Celo. Play free, earn CELO, contribute photos for passive royalties.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <span className="text-xs text-text-secondary">Open source · MIT License</span>
              </div>
              <a
                href="https://github.com/mie-intel/duelsnap-celo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DuelSnap on GitHub"
                className="text-text-secondary/50 hover:text-text-primary transition-colors duration-150"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* App links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              App
            </p>
            <nav className="flex flex-col gap-2">
              {appLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Section links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Learn
            </p>
            <nav className="flex flex-col gap-2">
              {sectionLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Celo Ecosystem links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Celo Ecosystem
            </p>
            <nav className="flex flex-col gap-2">
              {celoEcosystemLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-primary transition-colors duration-150 flex items-center gap-1"
                >
                  {l.label}
                  <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5 opacity-40" aria-hidden="true">
                    <path d="M4 1.5H1.5v7h7V6M5.5 1.5H8.5v3M8.5 1.5l-4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs text-text-secondary">
            © 2025 DuelSnap. Open source · MIT License
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-text-secondary font-mono">Celo Mainnet · Chain 42220</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
