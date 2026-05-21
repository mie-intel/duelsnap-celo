"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "../../../hooks/useWallet";
import { useOnboarding } from "../OnboardingContext";
import Button from "../../ui/Button";
import SkipButton from "../SkipButton";

export default function StepConnect() {
  const { isConnected, login } = useWallet();
  const { completeStep } = useOnboarding();

  // Auto-advance once wallet is connected
  useEffect(() => {
    if (isConnected) {
      completeStep("connect");
    }
  }, [isConnected, completeStep]);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-20 h-20 rounded-[1.25rem] flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), #FBCC5C)",
          boxShadow: "0 12px 40px rgba(53,208,127,0.3)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0F001F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M16 12h.01" />
        </svg>
      </motion.div>

      <div className="text-center">
        <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-sans leading-relaxed max-w-[260px]">
          Use MiniPay or any Celo-compatible wallet to get started. Your wallet is your identity.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button onClick={login} size="md" className="w-full">
          Connect Wallet
        </Button>
        <SkipButton />
      </div>
    </div>
  );
}
