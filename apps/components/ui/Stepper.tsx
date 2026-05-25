import type { ReactNode } from "react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Multi-step progress indicator.
 * Shows completed, current, and upcoming steps.
 *
 * @example
 * const steps = [
 *   { label: "Connect Wallet" },
 *   { label: "Set Stake", description: "Choose how much cUSD to wager" },
 *   { label: "Find Opponent" },
 *   { label: "Play!" },
 * ];
 *
 * <Stepper steps={steps} currentStep={1} />
 */
export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  className = "",
}: StepperProps) {
  if (orientation === "vertical") {
    return (
      <VerticalStepper
        steps={steps}
        currentStep={currentStep}
        className={className}
      />
    );
  }

  return (
    <HorizontalStepper
      steps={steps}
      currentStep={currentStep}
      className={className}
    />
  );
}

function StepIcon({
  index,
  status,
}: {
  index: number;
  status: "completed" | "current" | "upcoming";
}) {
  if (status === "completed") {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-text-inverse text-sm font-bold shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  if (status === "current") {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary bg-primary/10 text-primary text-sm font-bold shrink-0">
        {index + 1}
      </span>
    );
  }

  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-3 bg-surface-2 text-text-secondary text-sm font-medium shrink-0">
      {index + 1}
    </span>
  );
}

function HorizontalStepper({
  steps,
  currentStep,
  className,
}: {
  steps: Step[];
  currentStep: number;
  className: string;
}) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const status =
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "current"
                : "upcoming";
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className={["flex items-center", isLast ? "" : "flex-1"].join(
                " "
              )}
            >
              <div className="flex flex-col items-center gap-1.5">
                <StepIcon index={index} status={status} />
                <span
                  className={[
                    "text-xs font-medium whitespace-nowrap",
                    status === "current"
                      ? "text-primary"
                      : status === "completed"
                        ? "text-text-primary"
                        : "text-text-secondary",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={[
                    "h-0.5 flex-1 mx-2 mb-5 rounded-full",
                    index < currentStep ? "bg-primary" : "bg-surface-3",
                  ].join(" ")}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function VerticalStepper({
  steps,
  currentStep,
  className,
}: {
  steps: Step[];
  currentStep: number;
  className: string;
}) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="space-y-0">
        {steps.map((step, index) => {
          const status =
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "current"
                : "upcoming";
          const isLast = index === steps.length - 1;

          return (
            <li key={step.label} className="flex gap-3">
              {/* Left: icon + line */}
              <div className="flex flex-col items-center">
                <StepIcon index={index} status={status} />
                {!isLast && (
                  <div
                    className={[
                      "w-0.5 flex-1 my-1 rounded-full",
                      index < currentStep ? "bg-primary" : "bg-surface-3",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Right: text */}
              <div className={["pb-6", isLast ? "pb-0" : ""].join(" ")}>
                <p
                  className={[
                    "text-sm font-semibold",
                    status === "current"
                      ? "text-primary"
                      : status === "completed"
                        ? "text-text-primary"
                        : "text-text-secondary",
                  ].join(" ")}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
