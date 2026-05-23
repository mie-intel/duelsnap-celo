"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const events = [
  { player: "Anya_K", action: "won", detail: "+0.087 CELO", accent: "var(--color-primary)" },
  { player: "Reza_M", action: "guessed", detail: "Big Ben correctly", accent: "var(--color-secondary)" },
  { player: "Lila_S", action: "entered PvP vs", detail: "Farid_T", accent: "var(--color-accent-pvp)" },
  { player: "Okeke_J", action: "earned royalty", detail: "+0.003 CELO", accent: "var(--color-primary)" },
  { player: "Mira_D", action: "answered", detail: "Eiffel Tower ✓", accent: "var(--color-secondary)" },
  { player: "Yusuf_A", action: "started paid session", detail: "0.01 CELO", accent: "var(--color-secondary)" },
  { player: "Sari_N", action: "won PvP", detail: "+0.087 CELO", accent: "var(--color-accent-pvp)" },
  { player: "Chen_W", action: "contributed photo", detail: "AI verified ✓", accent: "var(--color-primary)" },
  { player: "Priya_R", action: "streak", detail: "5/5 correct", accent: "var(--color-secondary)" },
  { player: "Kofi_B", action: "guessed", detail: "Burj Khalifa ✓", accent: "var(--color-primary)" },
  { player: "Amara_L", action: "tx confirmed on Celo", detail: "0x3f4a...d82c", accent: "var(--color-primary)" },
  { player: "Davi_S", action: "withdrew royalty", detail: "+0.012 CELO", accent: "var(--color-primary)" },
  { player: "Hana_W", action: "joined via MiniPay", detail: "instant connect", accent: "var(--color-primary)" },
  { player: "Omar_F", action: "won 1v1 duel", detail: "+0.87 CELO on-chain", accent: "var(--color-accent-pvp)" },
  { player: "Noa_T", action: "paid in", detail: "cUSD · fee abstracted", accent: "var(--color-secondary)" },
  { player: "Zara_K", action: "earned from photo", detail: "Carbon-neutral tx ✓", accent: "var(--color-primary)" },
];

const Dot = ({ color }: { color: string }) => (
  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
);

const Item = ({ event }: { event: typeof events[0] }) => {
  const isTxHash = event.detail.startsWith("0x");
  return (
    <span className="inline-flex items-center gap-2 px-5 text-xs font-sans">
      <Dot color={event.accent} />
      <span className="font-semibold text-text-primary">{event.player}</span>
      <span className="text-text-secondary">{event.action}</span>
      <span
        className={isTxHash ? "font-mono text-[10px] opacity-70" : "font-semibold"}
        style={{ color: event.accent }}
      >
        {event.detail}
      </span>
    </span>
  );
};

const Separator = () => (
  <span className="text-text-secondary/30 px-3 select-none">·</span>
);

export const ActivityTicker = memo(function ActivityTicker() {
  const reduced = useReducedMotion();
  const doubled = [...events, ...events];

  if (reduced) {
    return (
      <div className="py-3 border-y border-[var(--color-border-subtle)] overflow-hidden">
        <div className="flex items-center gap-0 max-w-[1400px] mx-auto px-6 flex-wrap gap-y-1">
          {events.map((e, i) => (
            <span key={i} className="inline-flex items-center">
              <Item event={e} />
              {i < events.length - 1 && <Separator />}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 border-y border-[var(--color-border-subtle)] overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg-page to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-page to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {doubled.map((e, i) => (
          <span key={i} className="inline-flex items-center">
            <Item event={e} />
            <Separator />
          </span>
        ))}
      </motion.div>
    </div>
  );
});
