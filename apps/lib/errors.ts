/**
 * Error handling utilities for DuelSnap.
 * Extracts user-friendly messages from contract reverts, RPC errors, and wagmi errors.
 */

// ─── Error Classes ────────────────────────────────────────────────────────────

export class ContractError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly txHash?: string,
  ) {
    super(message);
    this.name = "ContractError";
  }
}

export class InsufficientFundsError extends ContractError {
  constructor() {
    super("Insufficient CELO balance", "INSUFFICIENT_FUNDS");
    this.name = "InsufficientFundsError";
  }
}

export class UserRejectedError extends Error {
  constructor() {
    super("Transaction cancelled by user");
    this.name = "UserRejectedError";
  }
}

// ─── Error Detection ─────────────────────────────────────────────────────────

/** Detect if user rejected/cancelled the transaction */
export function isUserRejected(error: unknown): boolean {
  if (!error) return false;
  const msg = getErrorMessage(error).toLowerCase();
  return (
    msg.includes("user rejected") ||
    msg.includes("user denied") ||
    msg.includes("rejected the request") ||
    (error as { code?: number }).code === 4001
  );
}

/** Detect insufficient funds */
export function isInsufficientFunds(error: unknown): boolean {
  const msg = getErrorMessage(error).toLowerCase();
  return (
    msg.includes("insufficient funds") ||
    msg.includes("insufficient balance") ||
    msg.includes("transfer amount exceeds balance")
  );
}

/** Detect network/RPC errors */
export function isNetworkError(error: unknown): boolean {
  const msg = getErrorMessage(error).toLowerCase();
  return (
    msg.includes("network") ||
    msg.includes("failed to fetch") ||
    msg.includes("could not coalesce") ||
    msg.includes("timeout")
  );
}

// ─── Message Extraction ───────────────────────────────────────────────────────

const FRIENDLY_ERRORS: Record<string, string> = {
  INSUFFICIENT_FUNDS: "Not enough CELO. Please add funds.",
  USER_REJECTED: "Transaction cancelled.",
  NETWORK_ERROR: "Network error. Check your connection.",
  MATCH_NOT_FOUND: "Match not found. It may have expired.",
  ALREADY_JOINED: "You've already joined this match.",
  MATCH_FULL: "Match is full.",
  GAME_IN_PROGRESS: "A game is already in progress.",
};

/**
 * Extract a user-friendly error message from any error.
 */
export function getUserFriendlyError(error: unknown): string {
  if (isUserRejected(error)) return FRIENDLY_ERRORS.USER_REJECTED;
  if (isInsufficientFunds(error)) return FRIENDLY_ERRORS.INSUFFICIENT_FUNDS;
  if (isNetworkError(error)) return FRIENDLY_ERRORS.NETWORK_ERROR;

  const msg = getErrorMessage(error);

  // Check for contract revert reasons
  for (const [key, friendly] of Object.entries(FRIENDLY_ERRORS)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return friendly;
  }

  // Truncate long error messages
  return msg.length > 100 ? `${msg.slice(0, 100)}…` : msg;
}

/**
 * Safely extract error message string from any thrown value.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (typeof e.reason === "string") return e.reason;
    if (typeof e.shortMessage === "string") return e.shortMessage;
  }
  return "An unknown error occurred";
}
