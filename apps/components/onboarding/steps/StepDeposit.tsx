"use client";

import { useOnboarding } from "../OnboardingContext";
import Button from "../../ui/Button";

const fundingOptions = [
  {
    label: "Fund via MiniPay",
    description: "Easiest on mobile — Opera's built-in Celo wallet.",
    href: "https://minipay.opera.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="20" height="13" rx="2.5" stroke="#35D07F" strokeWidth="1.8" />
        <path d="M2 10h20" stroke="#35D07F" strokeWidth="1.8" />
        <rect x="15" y="13" width="4" height="3" rx="1" fill="#35D07F" />
      </svg>
    ),
  },
  {
    label: "Buy on Coinbase",
    description: "Purchase CELO with a credit card or bank transfer.",
    href: "https://www.coinbase.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#FBCC5C" strokeWidth="1.8" />
        <text x="12" y="16" textAnchor="middle" fill="#FBCC5C" fontSize="10" fontWeight="700">₡</text>
      </svg>
    ),
  },
];

export default function StepDeposit() {
  const { completeStep, skip } = useOnboarding();

  function handleComplete() {
    completeStep("deposit");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Step 4 of 4</p>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
          Fund your wallet
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Add CELO to play paid games and wager in 1v1 duels. Free mode is always available.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {fundingOptions.map((option) => (
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
            <svg className="ml-auto flex-shrink-0 mt-1.5" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary" />
            </svg>
          </a>
        ))}
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleComplete}>
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
