"use client";

import { useState } from "react";
import FadeIn from "./FadeIn";

const faqs = [
  {
    q: "Do I need a crypto wallet to play?",
    a: "No. Free Casual mode works without any wallet — just open and play. A Celo-compatible wallet (MiniPay, MetaMask, Valora, etc.) is only needed for Paid Casual and PvP modes.",
  },
  {
    q: "How does the PvP wager work?",
    a: "Both players stake 0.1 CELO before the match. After 10 questions, the player with the higher score wins 0.174 CELO (87% of the 0.2 CELO pool). The remaining 13% goes to the protocol treasury and contributors.",
  },
  {
    q: "Can I pay with cUSD instead of CELO?",
    a: "Yes — cUSD is now supported for Paid Casual games (V3 upgrade). The first time you play, you approve the game contract to spend your cUSD once. After that, each 0.01 cUSD session fee is deducted automatically from your cUSD balance — no need to hold native CELO for entry fees.",
  },
  {
    q: "How do photo royalties get paid out?",
    a: "Royalties accumulate on-chain as Paid Casual sessions complete. Each session distributes 27% of fees proportionally to all contributors whose photos were used in that session. Payouts are claimable directly from your profile.",
  },
  {
    q: "What happens if a PvP match ends in a tie?",
    a: "If both players score identically, the stakes are refunded minus gas fees. Ties are rare due to the tiebreaker: fastest correct answer wins the round.",
  },
  {
    q: "What kind of photos can I contribute?",
    a: "Any original image where the subject has a clear, single correct answer. Landmarks, animals, famous artworks, logos, foods. No people's faces, no NSFW content, no copyright-protected images.",
  },
  {
    q: "Which network does DuelSnap run on?",
    a: "Celo mainnet. All transactions are settled on Celo L1 — no bridges, no L2 complexity. Gas fees are typically under $0.01.",
  },
  {
    q: "Does DuelSnap work with MiniPay?",
    a: "Yes — DuelSnap is MiniPay-native. Open it inside the Opera MiniPay browser and your wallet connects instantly with no popups or manual approvals. Your CELO balance is ready to wager immediately.",
  },
  {
    q: "What is fee abstraction on Celo?",
    a: "Celo's fee abstraction layer (Mento protocol) lets you pay gas fees in cUSD instead of CELO. That means you never need to hold CELO just for gas — your stablecoin balance covers everything.",
  },
  {
    q: "Are DuelSnap transactions carbon-neutral?",
    a: "Celo is a carbon-negative blockchain. Every transaction on DuelSnap — including wagers, royalty distributions, and game settlements — has a net-negative carbon footprint through Celo's on-chain carbon offset mechanism.",
  },
  {
    q: "How do I get cUSD to play?",
    a: "You can get cUSD through several routes: swap CELO → cUSD on Uniswap or Mento directly in your wallet, receive it from a friend, or buy it with a card on exchanges that support Celo assets. Inside MiniPay, cUSD is the default balance — you likely already have some.",
  },
  {
    q: "Can I play DuelSnap on desktop?",
    a: "Yes. DuelSnap has a full desktop layout with a sidebar navigation. Connect any EVM wallet (MetaMask, Coinbase Wallet, WalletConnect) to play on desktop. MiniPay's auto-connect flow is mobile-only, but all other features are identical.",
  },
  {
    q: "How many questions are in each game?",
    a: "Each casual game and PvP ranked match uses 10 questions drawn randomly from the active question pool. Questions are filtered by difficulty if you use the category picker, otherwise drawn from the full pool.",
  },
  {
    q: "What happens if a PvP opponent disconnects mid-match?",
    a: "GameSession has a built-in timeout. If either player fails to submit answers within the timeout window, the session is marked as abandoned and both players receive a full refund — no CELO is lost.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <FadeIn className="md:col-span-1 md:sticky md:top-28 md:self-start">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary tracking-tight leading-tight">
              Common questions
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-4 max-w-[32ch]">
              Can't find your answer? Open a discussion on GitHub.
            </p>
          </FadeIn>

          <div className="md:col-span-2 flex flex-col divide-y divide-[var(--color-border-subtle)]">
            {faqs.map((faq, i) => (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left py-5 lg:py-6 flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  aria-expanded={open === i}
                >
                  <span className="font-display font-semibold text-text-primary text-base lg:text-lg leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`text-text-secondary mt-0.5 flex-shrink-0 transition-transform duration-200 ${
                      open === i ? "rotate-45" : "rotate-0"
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open === i ? "200px" : "0px" }}
                >
                  <div className="pb-5">
                    <p className="text-text-secondary text-sm lg:text-base leading-relaxed max-w-[60ch]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
