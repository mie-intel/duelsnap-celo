/**
 * Formatting utilities for numbers, CELO amounts, addresses, and dates.
 * All functions are pure and safe for SSR.
 */

// ─── Numbers ────────────────────────────────────────────────────────────────

/**
 * Format a large integer with compact notation.
 * 1_234 → "1,234" | 1_234_567 → "1.2M" | 1_234_567_890 → "1.2B"
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

/**
 * Format a percentage with optional decimals.
 * formatPercent(0.753) → "75.3%"
 */
export function formatPercent(ratio: number, decimals = 1): string {
  return `${(ratio * 100).toFixed(decimals)}%`;
}

// ─── CELO / Tokens ──────────────────────────────────────────────────────────

/**
 * Format a CELO amount from bigint (wei) to display string.
 * 1_000_000_000_000_000_000n → "1.00 CELO"
 */
export function formatCELO(wei: bigint, decimals = 2): string {
  const value = Number(wei) / 1e18;
  return `${value.toFixed(decimals)} CELO`;
}

/**
 * Format a cUSD amount from bigint (6 or 18 decimals) to display string.
 */
export function formatCUSD(amount: bigint, tokenDecimals = 18, displayDecimals = 2): string {
  const value = Number(amount) / 10 ** tokenDecimals;
  return `$${value.toFixed(displayDecimals)}`;
}

/**
 * Short CELO display — trims trailing zeros.
 * 1.50 → "1.5 CELO" | 1.00 → "1 CELO"
 */
export function formatCELOShort(wei: bigint): string {
  const value = Number(wei) / 1e18;
  const fixed = value.toFixed(4).replace(/\.?0+$/, "");
  return `${fixed} CELO`;
}

// ─── Addresses ──────────────────────────────────────────────────────────────

/**
 * Shorten an Ethereum address.
 * "0x1234567890abcdef" → "0x1234…cdef"
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

// ─── Dates ──────────────────────────────────────────────────────────────────

/**
 * Relative time from timestamp.
 * Returns "just now", "3m ago", "2h ago", "5d ago", or locale date.
 */
export function formatRelativeTime(timestamp: number | Date): string {
  const now = Date.now();
  const ts = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const delta = Math.floor((now - ts) / 1000); // seconds

  if (delta < 60) return "just now";
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  if (delta < 604800) return `${Math.floor(delta / 86400)}d ago`;

  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a duration in seconds to mm:ss.
 * 90 → "1:30"
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
