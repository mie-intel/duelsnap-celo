"use client";

import { useOnboarding } from "../OnboardingContext";
import { useWallet } from "../../../hooks/useWallet";
import { useCUSDBalance } from "../../../hooks/useCUSDBalance";
import Button from "../../ui/Button";

const externalOptions = [
  {
    label: "Buy on Coinbase",
    description: "Purchase CELO or cUSD with a credit card or bank transfer.",
    href: "https://www.coinbase.com",
    accent: "#FBCC5C",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#FBCC5C" strokeWidth="1.8" />
        <text x="12" y="16" textAnchor="middle" fill="#FBCC5C" fontSize="10" fontWeight="700">₡</text>
      </svg>
    ),
  },
  {
    label: "Get MiniPay",
    description: "Opera's Celo wallet — instant CELO top-up on mobile.",
    href: "https://www.opera.com/mobile/mini",
    accent: "#35D07F",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="20" height="13" rx="2.5" stroke="#35D07F" strokeWidth="1.8" />
        <path d="M2 10h20" stroke="#35D07F" strokeWidth="1.8" />
        <rect x="15" y="13" width="4" height="3" rx="1" fill="#35D07F" />
      </svg>
    ),
  },
];

export default function StepDeposit() {
  const { completeStep, skip } = useOnboarding();
  const { isMiniPay, address } = useWallet();
  const { balanceFormatted, loading } = useCUSDBalance(address);

  const hasBalance = !loading && Number(balanceFormatted) > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Step 4 of 4</p>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
          {isMiniPay ? "Your MiniPay wallet is ready" : "Fund your wallet"}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isMiniPay
            ? "CELO and cUSD in your MiniPay balance work directly in DuelSnap — no extra steps."
            : "Add CELO or cUSD to play paid games and wager in 1v1 duels. Free mode is always available."}
        </p>
      </div>

      {isMiniPay ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #35D07F, #25A060)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
              <path d="M5 12l5 5L20 7" stroke="#0F001F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text-primary text-sm">Connected via MiniPay</p>
            {loading ? (
              <p className="text-text-secondary text-xs mt-0.5">Loading balance…</p>
            ) : (
              <p className="text-text-secondary text-xs mt-0.5 font-mono">
                {hasBalance ? `${balanceFormatted} cUSD available` : "Top up cUSD to play paid modes"}
              </p>
            )}
          </div>
          <span className="text-primary text-xs font-bold uppercase tracking-wider">Ready</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {externalOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-2xl bg-surface-1 border border-border-subtle hover:border-border-mid transition-colors"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-bg-page flex items-center justify-center mt-0.5">
                {option.icon}
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-0.5">{option.label}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{option.description}</p>
              </div>
              <svg className="ml-auto flex-shrink-0 mt-1.5 text-text-secondary" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      )}

      {/* cUSD stablecoin note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-1 border border-border-subtle">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="text-xs text-text-secondary leading-relaxed">
          <span className="text-primary font-semibold">cUSD accepted</span> · stablecoin option for Paid Casual games — 1 cUSD ≈ $1 USD, always stable.
        </p>
      </div>

      {/* Fee abstraction note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-1 border border-border-subtle">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="text-xs text-text-secondary leading-relaxed">
          On Celo, you can pay gas in <span className="text-primary font-semibold">cUSD</span> — no CELO needed just for fees (fee abstraction via Mento).
        </p>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={() => completeStep("deposit")}>
        Start Playing
      </Button>

      <button
        onClick={skip}
        className="text-text-secondary text-sm underline underline-offset-2 hover:text-text-primary transition-colors mx-auto"
      >
        Skip for now
      </button>
    </div>
  );
}
