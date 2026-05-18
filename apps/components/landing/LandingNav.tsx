"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[var(--z-sticky-nav)] transition-all duration-300 ${
        scrolled
          ? "bg-bg-page/90 backdrop-blur-xl border-b border-[var(--color-border-subtle)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="DuelSnap"
            width={32}
            height={32}
            className="rounded-lg group-hover:scale-105 transition-transform duration-200"
          />
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">
            DuelSnap
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium"
          >
            How It Works
          </Link>
          <Link
            href="#game-modes"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium"
          >
            Game Modes
          </Link>
          <Link
            href="#earn"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium"
          >
            Earn
          </Link>
        </nav>

        <Link
          href="/play"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-text-inverse font-semibold text-sm hover:bg-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
        >
          Play Now
        </Link>
      </div>
    </header>
  );
}
