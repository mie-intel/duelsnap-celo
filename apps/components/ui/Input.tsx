"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type InputVariant = "default" | "error" | "success";
type InputSize = "sm" | "md" | "lg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visual state */
  variant?: InputVariant;
  /** Height/text size */
  size?: InputSize;
  /** Label text */
  label?: string;
  /** Hint shown below input */
  hint?: string;
  /** Error message (sets variant=error) */
  error?: string;
  /** Icon or element on left side */
  leftAddon?: React.ReactNode;
  /** Icon or element on right side */
  rightAddon?: React.ReactNode;
  /** Full width (default: true) */
  fullWidth?: boolean;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

const variantClasses: Record<InputVariant, string> = {
  default:
    "border-surface-3 bg-surface-1 focus:border-primary focus:ring-1 focus:ring-primary/30",
  error:
    "border-red-500 bg-surface-1 focus:border-red-500 focus:ring-1 focus:ring-red-500/30",
  success:
    "border-green-500 bg-surface-1 focus:border-green-500 focus:ring-1 focus:ring-green-500/30",
};

/**
 * Styled text input with label, hints, error state, and left/right addons.
 *
 * @example
 * <Input label="Username" placeholder="Enter your name" />
 * <Input error="Required" label="Email" type="email" />
 * <Input leftAddon={<SearchIcon />} placeholder="Search players..." />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      hint,
      error,
      leftAddon,
      rightAddon,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant: InputVariant = error ? "error" : variant;
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={fullWidth ? "w-full" : "inline-flex flex-col"}>
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1 text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 flex items-center text-text-muted pointer-events-none">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={[
              "w-full rounded-lg border outline-none transition-colors duration-150",
              "placeholder:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              variantClasses[resolvedVariant],
              leftAddon ? "pl-9" : "",
              rightAddon ? "pr-9" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {rightAddon && (
            <span className="absolute right-3 flex items-center text-text-muted pointer-events-none">
              {rightAddon}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            id={error ? `${inputId}-error` : `${inputId}-hint`}
            className={`mt-1 text-xs ${error ? "text-red-400" : "text-text-muted"}`}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
