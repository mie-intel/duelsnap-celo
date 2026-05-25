"use client";

import { useLocalStorage } from "./useLocalStorage";

interface SoundSettings {
  muted: boolean;
  volume: number; // 0–1
}

const DEFAULT: SoundSettings = { muted: false, volume: 0.7 };

/**
 * Persisted sound settings (mute toggle + volume).
 * Stored in localStorage so preference survives sessions.
 *
 * @example
 * const { muted, volume, toggleMute, setVolume } = useSoundSettings();
 */
export function useSoundSettings() {
  const [settings, setSettings] = useLocalStorage<SoundSettings>(
    "game:sound",
    DEFAULT,
  );

  function toggleMute() {
    setSettings((prev) => ({ ...prev, muted: !prev.muted }));
  }

  function setVolume(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    setSettings((prev) => ({ ...prev, volume: clamped, muted: clamped === 0 }));
  }

  return {
    muted: settings.muted,
    volume: settings.volume,
    effectiveVolume: settings.muted ? 0 : settings.volume,
    toggleMute,
    setVolume,
  };
}
