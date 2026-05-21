"use client";

import { useOnboarding } from "./OnboardingContext";

interface SkipButtonProps {
  onSkip?: () => void;
  label?: string;
}

export default function SkipButton({ onSkip, label = "Skip for now" }: SkipButtonProps) {
  const { skip } = useOnboarding();

  function handleSkip() {
    skip();
    onSkip?.();
  }

  return (
    <button
      onClick={handleSkip}
      className="text-text-secondary text-sm underline underline-offset-2 hover:text-text-primary transition-colors"
    >
      {label}
    </button>
  );
}
