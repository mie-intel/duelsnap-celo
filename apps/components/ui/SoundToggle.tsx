"use client";

import { useSoundSettings } from "../../hooks/useSoundSettings";

interface SoundToggleProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Mute/unmute button using persisted sound settings.
 * Drop-in anywhere in the UI (settings panel, game header, etc.)
 */
export function SoundToggle({ className = "", showLabel = false }: SoundToggleProps) {
  const { muted, toggleMute } = useSoundSettings();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      aria-pressed={muted}
      className={[
        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        muted
          ? "bg-surface-2 text-text-secondary"
          : "bg-surface-1 text-text-primary hover:bg-surface-2",
        className,
      ].join(" ")}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {muted ? "🔇" : "🔊"}
      </span>
      {showLabel && <span>{muted ? "Sound off" : "Sound on"}</span>}
    </button>
  );
}
