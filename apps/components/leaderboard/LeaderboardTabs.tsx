"use client";

import { motion } from "framer-motion";

type Tab = "global" | "weekly";

interface LeaderboardTabsProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; sublabel: string }[] = [
  { id: "global", label: "All Time", sublabel: "Global" },
  { id: "weekly", label: "This Week", sublabel: "Weekly" },
];

export function LeaderboardTabs({ active, onChange }: LeaderboardTabsProps) {
  return (
    <div className="flex gap-1 bg-bg-card rounded-2xl p-1 mb-5 relative" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          onClick={() => onChange(tab.id)}
          className="relative flex-1 py-2.5 rounded-xl text-sm font-semibold font-sans transition-colors z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          aria-selected={active === tab.id}
        >
          {active === tab.id && (
            <motion.div
              layoutId="tab-highlight"
              className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/30"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 transition-colors ${
              active === tab.id ? "text-primary" : "text-text-secondary"
            }`}
          >
            {tab.label}
          </span>
        </button>
      ))}
      <div className="flex items-center gap-1 px-2 shrink-0">
        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[8px] font-mono text-text-secondary/30 uppercase tracking-widest">Celo</span>
      </div>
    </div>
  );
}
