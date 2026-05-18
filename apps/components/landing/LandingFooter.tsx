import Link from "next/link";
import Image from "next/image";

const links = [
  { label: "Play", href: "/play" },
  { label: "PvP Arena", href: "/pvp/lobby" },
  { label: "Contribute", href: "/contribute" },
  { label: "Activity", href: "/activity" },
  { label: "Profile", href: "/profile" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] py-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="DuelSnap"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-display font-bold text-base text-text-primary tracking-tight">
              DuelSnap
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="text-xs text-text-secondary">
            Built on{" "}
            <span className="text-primary font-semibold">Celo</span>{" "}
            · Open source
          </div>
        </div>
      </div>
    </footer>
  );
}
