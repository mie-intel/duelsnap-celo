"use client";

import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import Button from "../../ui/Button";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <ellipse cx="10" cy="10" rx="9" ry="6" stroke="#35D07F" strokeWidth="1.8" />
        <circle cx="10" cy="10" r="3" fill="#35D07F" />
      </svg>
    ),
    label: "Guess the picture",
    description: "Each round shows a blurred or partial image — guess faster to score higher.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="#FBCC5C" strokeWidth="1.8" />
        <text x="10" y="14" textAnchor="middle" fill="#FBCC5C" fontSize="9" fontWeight="700">₡</text>
      </svg>
    ),
    label: "Win CELO rewards",
    description: "Top scores in paid and PvP modes earn real CELO straight to your wallet.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="#35D07F" strokeWidth="1.8" />
        <circle cx="10" cy="10" r="2.5" fill="#35D07F" />
        <path d="M6 4V3M14 4V3" stroke="#35D07F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    label: "Contribute & earn royalties",
    description: "Submit your own photos. Every time someone plays your image, you earn a cut.",
  },
];

export default function StepTutorial() {
  const { completeStep } = useOnboarding();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-mono text-primary uppercase tracking-widest">Step 3 of 4</p>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/8 border border-primary/15">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Celo</span>
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
          How DuelSnap works
        </h2>
      </div>

      <ul className="flex flex-col gap-4" role="list">
        {features.map((feature, i) => (
          <motion.li
            key={feature.label}
            className="flex items-start gap-4 p-4 rounded-2xl bg-surface-1 border border-border-subtle"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-bg-page flex items-center justify-center mt-0.5">
              {feature.icon}
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm mb-0.5">{feature.label}</p>
              <p className="text-text-secondary text-xs leading-relaxed">{feature.description}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <Button variant="primary" size="lg" className="w-full" onClick={() => completeStep("tutorial")}>
          Got it, let&apos;s play
        </Button>
        <p className="text-center text-[9px] font-mono text-text-secondary/40 uppercase tracking-widest">
          All games run on Celo Mainnet · Chain 42220
        </p>
      </div>
    </div>
  );
}
