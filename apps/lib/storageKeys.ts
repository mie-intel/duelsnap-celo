/**
 * localStorage key constants for DuelSnap.
 * Centralizes all storage keys to avoid typos and key collisions.
 *
 * @example
 * import { STORAGE_KEYS } from '@/lib/storageKeys';
 * localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, 'true');
 */
export const STORAGE_KEYS = {
  // Sound preferences
  SOUND_MUTED:       "duelsnap:sound:muted",
  SOUND_VOLUME:      "duelsnap:sound:volume",

  // Onboarding
  ONBOARDING_DONE:   "duelsnap:onboarding:completed",
  ONBOARDING_STEP:   "duelsnap:onboarding:step",

  // Game preferences
  DEFAULT_WAGER:     "duelsnap:game:default-wager",
  SELECTED_CATEGORY: "duelsnap:game:category",
  SELECTED_DIFF:     "duelsnap:game:difficulty",

  // Theme / display
  THEME:             "duelsnap:ui:theme",

  // Leaderboard filter
  LB_TAB:            "duelsnap:leaderboard:tab",

  // Session (cleared on logout)
  WALLET_HINT:       "duelsnap:session:wallet-hint",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * All session-scoped keys — should be cleared on disconnect/logout.
 */
export const SESSION_STORAGE_KEYS: StorageKey[] = [
  STORAGE_KEYS.WALLET_HINT,
];

/**
 * Clear all DuelSnap keys from localStorage.
 * Use on hard reset / account switch.
 */
export function clearAllStorage(): void {
  if (typeof window === "undefined") return;
  for (const key of Object.values(STORAGE_KEYS)) {
    localStorage.removeItem(key);
  }
}

/**
 * Clear only session-scoped keys.
 */
export function clearSessionStorage(): void {
  if (typeof window === "undefined") return;
  for (const key of SESSION_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}
