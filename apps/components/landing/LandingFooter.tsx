import Link from "next/link";
import Image from "next/image";

const appLinks = [
  { label: "Play Free", href: "/play" },
  { label: "PvP Arena", href: "/pvp/lobby" },
  { label: "Contribute", href: "/contribute" },
  { label: "Activity", href: "/activity" },
];

const sectionLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Game Modes", href: "#game-modes" },
  { label: "Earn", href: "#earn" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:col-span-1">
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
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
              <span className="text-xs text-text-secondary">Open source · MIT License</span>
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

          {/* Network */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Network
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <span className="text-sm text-text-secondary">
                  <span className="text-primary font-semibold">Celo</span> Mainnet · Live
                </span>
              </div>
              <span className="text-xs text-text-secondary">Carbon-neutral L1</span>
              <span className="text-xs text-text-secondary">EVM compatible</span>
              <span className="text-xs text-text-secondary">MiniPay ready</span>
              <span className="text-xs text-text-secondary">Gas &lt; $0.01</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs text-text-secondary">
            © 2026 DuelSnap. Open source.
          </span>
          <span className="text-xs text-text-secondary">
            Deployed on Celo Mainnet
          </span>
        </div>
      </div>
    </footer>
  );
}
