import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — DuelSnap",
  description: "This page doesn't exist. Head back to play!",
};

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-20 text-center gap-6">
      <div className="text-7xl select-none">🔍</div>

      <div className="flex flex-col gap-2 max-w-xs">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          404 — Lost?
        </h1>
        <p className="text-text-secondary font-sans text-sm leading-relaxed">
          This page doesn&apos;t exist. Maybe you mistyped a URL, or this duel
          expired.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/play"
          className="w-full bg-primary text-text-inverse font-semibold py-4 rounded-2xl text-center text-base transition-all duration-150 hover:bg-primary-dark active:scale-95"
        >
          Play Now
        </Link>
        <Link
          href="/"
          className="w-full border-2 border-primary text-primary font-semibold py-4 rounded-2xl text-center text-base transition-all duration-150 hover:bg-primary-light active:scale-95"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
