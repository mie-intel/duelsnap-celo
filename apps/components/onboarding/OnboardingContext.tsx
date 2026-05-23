"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type OnboardingStep = "connect" | "username" | "tutorial" | "deposit" | "done";

interface OnboardingState {
  completed: boolean;
  step: OnboardingStep;
  skipped: boolean;
}

interface OnboardingContextValue {
  isOpen: boolean;
  currentStep: OnboardingStep;
  goToStep: (step: OnboardingStep) => void;
  completeStep: (step: OnboardingStep) => void;
  skip: () => void;
  isCompleted: boolean;
}

const STORAGE_KEY = "duelsnap_onboarding_v1";

const STEP_ORDER: OnboardingStep[] = ["connect", "username", "tutorial", "deposit", "done"];

function nextStep(step: OnboardingStep): OnboardingStep {
  const idx = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
}

function loadState(): OnboardingState {
  if (typeof window === "undefined") return { completed: false, step: "connect", skipped: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: false, step: "connect", skipped: false };
    return JSON.parse(raw) as OnboardingState;
  } catch {
    return { completed: false, step: "connect", skipped: false };
  }
}

function saveState(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>({ completed: false, step: "connect", skipped: false });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setHydrated(true);
    if (!loaded.completed && !loaded.skipped) {
      setIsOpen(true);
    }
  }, []);

  const goToStep = useCallback((step: OnboardingStep) => {
    setState((prev) => {
      const next = { ...prev, step };
      saveState(next);
      return next;
    });
  }, []);

  const completeStep = useCallback((step: OnboardingStep) => {
    const next = nextStep(step);
    setState((prev) => {
      const isDone = next === "done";
      const updated: OnboardingState = { ...prev, step: next, completed: isDone };
      saveState(updated);
      return updated;
    });
    if (next === "done") {
      setIsOpen(false);
    }
  }, []);

  const skip = useCallback(() => {
    setState((prev) => {
      const updated: OnboardingState = { ...prev, completed: true, skipped: true };
      saveState(updated);
      return updated;
    });
    setIsOpen(false);
  }, []);

  if (!hydrated) return <>{children}</>;

  return (
    <OnboardingContext.Provider
      value={{
        isOpen,
        currentStep: state.step,
        goToStep,
        completeStep,
        skip,
        isCompleted: state.completed,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

const noopOnboarding: OnboardingContextValue = {
  isOpen: false,
  currentStep: "connect",
  goToStep: () => {},
  completeStep: () => {},
  skip: () => {},
  isCompleted: false,
};

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  return ctx ?? noopOnboarding;
}
