"use client";

import { useState } from "react";
import { useWallet } from "../../../hooks/useWallet";
import { useOnboarding } from "../OnboardingContext";
import Button from "../../ui/Button";

const HANDLE_REGEX = /^[a-zA-Z0-9_]*$/;

export default function StepUsername() {
  const { address } = useWallet();
  const { completeStep, skip } = useOnboarding();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");

  function validate(value: string): string {
    if (!value.trim()) return "Handle cannot be empty";
    if (!HANDLE_REGEX.test(value)) return "Only letters, numbers, and underscores";
    if (value.length < 2) return "At least 2 characters";
    return "";
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.slice(0, 20);
    setHandle(value);
    if (error) setError(validate(value));
  }

  function handleSave() {
    const err = validate(handle);
    if (err) { setError(err); return; }
    if (address) {
      try {
        localStorage.setItem(`duelsnap_username_${address}`, handle);
      } catch { /* ignore */ }
    }
    completeStep("username");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Step 2 of 4</p>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
          Choose your handle
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={handle}
          onChange={handleChange}
          maxLength={20}
          placeholder="e.g. Mira_Snap"
          className="w-full px-4 py-3 rounded-xl bg-bg-page border border-border-mid text-text-primary font-sans placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
          aria-label="Username handle"
        />
        {handle && !error && (
          <p className="font-mono text-sm text-primary pl-1">
            {handle}.celo
          </p>
        )}
        {error && (
          <p className="text-error text-xs pl-1">{error}</p>
        )}
        <p className="text-text-secondary text-xs pl-1">
          Handle is stored locally — no on-chain tx needed
        </p>
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleSave}>
        Save Handle
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
