/**
 * Input validation utilities for DuelSnap.
 * All functions are pure, SSR-safe, and return typed result objects.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── Wallet / EVM ────────────────────────────────────────────────────────────

/**
 * Validates an EVM wallet address (0x + 40 hex chars).
 *
 * @example
 * validateAddress("0xabc123...") // { valid: true }
 * validateAddress("not-an-address") // { valid: false, error: "Invalid address format" }
 */
export function validateAddress(address: string): ValidationResult {
  if (!address) return { valid: false, error: "Address is required" };
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return { valid: false, error: "Invalid Ethereum address format" };
  }
  return { valid: true };
}

/**
 * Validates a transaction hash (0x + 64 hex chars).
 */
export function validateTxHash(hash: string): ValidationResult {
  if (!hash) return { valid: false, error: "Transaction hash is required" };
  if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
    return { valid: false, error: "Invalid transaction hash format" };
  }
  return { valid: true };
}

// ─── Game / Stake ─────────────────────────────────────────────────────────────

const MIN_STAKE_CUSD = 0.01;
const MAX_STAKE_CUSD = 100;

/**
 * Validates a cUSD stake amount.
 *
 * @param amount - Amount in cUSD (human-readable, not wei)
 * @param balance - User's current cUSD balance
 *
 * @example
 * validateStake(0.5, 10)  // { valid: true }
 * validateStake(0, 10)    // { valid: false, error: "Minimum stake is 0.01 cUSD" }
 * validateStake(50, 10)   // { valid: false, error: "Insufficient balance" }
 */
export function validateStake(
  amount: number,
  balance?: number
): ValidationResult {
  if (Number.isNaN(amount) || amount <= 0) {
    return { valid: false, error: `Minimum stake is ${MIN_STAKE_CUSD} cUSD` };
  }
  if (amount < MIN_STAKE_CUSD) {
    return { valid: false, error: `Minimum stake is ${MIN_STAKE_CUSD} cUSD` };
  }
  if (amount > MAX_STAKE_CUSD) {
    return { valid: false, error: `Maximum stake is ${MAX_STAKE_CUSD} cUSD` };
  }
  if (balance !== undefined && amount > balance) {
    return { valid: false, error: "Insufficient cUSD balance" };
  }
  return { valid: true };
}

/**
 * Validates a username / display name.
 * Rules: 3–20 chars, alphanumeric + underscores only.
 */
export function validateUsername(name: string): ValidationResult {
  if (!name) return { valid: false, error: "Username is required" };
  if (name.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }
  if (name.length > 20) {
    return { valid: false, error: "Username must be 20 characters or fewer" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { valid: true };
}

// ─── Generic ──────────────────────────────────────────────────────────────────

/**
 * Checks that a required field is non-empty.
 */
export function validateRequired(
  value: string,
  fieldName = "Field"
): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

/**
 * Validates a positive integer (e.g. question count, max players).
 */
export function validatePositiveInt(
  value: number,
  fieldName = "Value",
  max?: number
): ValidationResult {
  if (!Number.isInteger(value) || value <= 0) {
    return { valid: false, error: `${fieldName} must be a positive integer` };
  }
  if (max !== undefined && value > max) {
    return { valid: false, error: `${fieldName} must be ${max} or fewer` };
  }
  return { valid: true };
}

/**
 * Run multiple validators and return the first failure, or valid if all pass.
 *
 * @example
 * const result = validateAll([
 *   validateRequired(name, 'Name'),
 *   validateUsername(name),
 * ]);
 */
export function validateAll(
  results: ValidationResult[]
): ValidationResult {
  const failure = results.find((r) => !r.valid);
  return failure ?? { valid: true };
}
