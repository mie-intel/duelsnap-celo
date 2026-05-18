"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#game-modes", label: "Game Modes" },
  { href: "#earn", label: "Earn" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[var(--z-sticky-nav)] transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-bg-page/95 backdrop-blur-xl border-b border-[var(--color-border-subtle)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMenuOpen(false)}
          >
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
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/play"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-text-inverse font-semibold text-sm hover:bg-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page min-h-[44px]"
            >
              Play Now
            </Link>

            <button
              type="button"
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px] items-center justify-center"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={`block w-5 h-0.5 bg-text-primary transition-all duration-200 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-text-primary transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-text-primary transition-all duration-200 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[calc(var(--z-sticky-nav)-1)] bg-bg-page/98 backdrop-blur-xl flex flex-col pt-20 px-6 pb-10 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-display font-semibold text-2xl text-text-primary py-3 border-b border-[var(--color-border-subtle)] hover:text-primary transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <Link
              href="/play"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center px-7 py-4 rounded-full bg-primary text-text-inverse font-bold text-base hover:bg-primary-dark transition-colors duration-150 min-h-[52px]"
            >
              Start Playing Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
