"use client";

import { useId } from "react";

interface SwitchProps {
  /** Controlled checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Description below label */
  description?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Label position (default: right) */
  labelPosition?: "left" | "right";
  className?: string;
}

/**
 * Toggle switch component — accessible alternative to checkbox for on/off settings.
 *
 * @example
 * const [muted, setMuted] = useState(false);
 * <Switch checked={muted} onChange={setMuted} label="Mute sounds" />
 *
 * <Switch
 *   checked={autoSign}
 *   onChange={setAutoSign}
 *   label="Auto-sign transactions"
 *   description="Sign low-value transactions automatically"
 * />
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  labelPosition = "right",
  className = "",
}: SwitchProps) {
  const id = useId();

  const toggle = (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={!label ? "Toggle" : undefined}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full",
        "transition-colors duration-200 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-surface-3",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );

  if (!label && !description) return toggle;

  return (
    <div
      className={[
        "flex items-center gap-3",
        labelPosition === "left" ? "flex-row-reverse justify-end" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {toggle}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={[
                "text-sm font-medium leading-tight",
                disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
