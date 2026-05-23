"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "../../../hooks/useWallet";
import { useOnboarding } from "../OnboardingContext";
import Button from "../../ui/Button";
import SkipButton from "../SkipButton";

export default function StepConnect() {
  const { isConnected, isMiniPay, login } = useWallet();
  const { completeStep } = useOnboarding();

  useEffect(() => {
    if (isConnected) completeStep("connect");
  }, [isConnected, completeStep]);

  if (isMiniPay) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative w-20 h-20 rounded-[1.25rem] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #35D07F 0%, #25A060 100%)",
            boxShadow: "0 12px 40px rgba(53,208,127,0.4)",
          }}
        >
          {/* MiniPay M logo */}
          <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
            <path d="M8 30V12l12 14 12-14v18" stroke="#0F001F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <motion.span
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-bg-card)] flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 18 }}
          >
            <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5" aria-hidden="true">
              <path d="M2 5l2 2 4-4" stroke="#0F001F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </motion.div>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-bold uppercase tracking-widest">MiniPay Detected</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-2">
            Connecting via MiniPay
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm font-sans leading-relaxed max-w-[260px]">
            Your Opera MiniPay wallet is being connected automatically.
          </p>
        </div>

        <motion.div
          className="flex items-center gap-2 text-text-secondary text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-primary" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>
          Waiting for confirmation…
        </motion.div>
      </div>
    );
  }

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
        <svg viewBox="0 0 24 24" fill="none" stroke="#0F001F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M16 12h.01" />
        </svg>
      </motion.div>

      <div className="text-center">
        <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-sans leading-relaxed max-w-[260px]">
          Use MiniPay or any Celo-compatible wallet. Your wallet is your identity.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button onClick={login} size="md" className="w-full">
          Connect Wallet
        </Button>
        <a
          href="https://www.opera.com/mobile/mini"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] text-sm hover:border-[var(--color-border-mid)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-primary" aria-hidden="true">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5.5 8a2.5 2.5 0 005 0 2.5 2.5 0 00-5 0z" fill="currentColor" />
          </svg>
          Get MiniPay — fastest on mobile
        </a>
        <SkipButton />
      </div>
    </div>
  );
}
