"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOnboarding, type OnboardingStep } from "./OnboardingContext";
import OnboardingProgress from "./OnboardingProgress";
import StepConnect from "./steps/StepConnect";
import StepUsername from "./steps/StepUsername";
import StepTutorial from "./steps/StepTutorial";
import StepDeposit from "./steps/StepDeposit";

const STEP_ORDER: OnboardingStep[] = ["connect", "username", "tutorial", "deposit"];

function stepIndex(step: OnboardingStep): number {
  const idx = STEP_ORDER.indexOf(step);
  return idx === -1 ? 0 : idx;
}

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  connect: StepConnect,
  username: StepUsername,
  tutorial: StepTutorial,
  deposit: StepDeposit,
};

export default function OnboardingWizard() {
  const { currentStep } = useOnboarding();
  const idx = stepIndex(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep] ?? StepConnect;

  return (
    <div className="flex flex-col w-full">
      <OnboardingProgress currentStep={idx + 1} totalSteps={STEP_ORDER.length} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
