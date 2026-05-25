/**
 * Input validation utilities.
 * All functions return `{ valid: boolean; error?: string }`.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────

/**
 * Check if string is a valid checksummed or lowercase Ethereum address.
 *
 * @example
 * validateAddress("0xabc...") // → { valid: true }
 * validateAddress("notanaddress") // → { valid: false, error: "Invalid address" }
 */
export function validateAddress(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Address is required" };
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) {
    return { valid: false, error: "Invalid Ethereum address" };
  }
  return { valid: true };
}

// ─── Username ────────────────────────────────────────────────────────────────

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;

/**
 * Validate a username (3–20 chars, alphanumeric + _ -)
 */
export function validateUsername(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Username is required" };
  if (value.length < USERNAME_MIN) {
    return { valid: false, error: `At least ${USERNAME_MIN} characters required` };
  }
  if (value.length > USERNAME_MAX) {
    return { valid: false, error: `Max ${USERNAME_MAX} characters` };
  }
  if (!USERNAME_RE.test(value)) {
    return { valid: false, error: "Only letters, numbers, _ and - allowed" };
  }
  return { valid: true };
}

// ─── Wager ────────────────────────────────────────────────────────────────────

/**
 * Validate a CELO wager amount (positive, within min/max).
 * Pass amounts in CELO (not wei) for human-readable errors.
 */
export function validateWager(
  amountCelo: number,
  minCelo = 0.1,
  maxCelo = 10,
): ValidationResult {
  if (!Number.isFinite(amountCelo) || amountCelo <= 0) {
    return { valid: false, error: "Enter a valid amount" };
  }
  if (amountCelo < minCelo) {
    return { valid: false, error: `Minimum wager is ${minCelo} CELO` };
  }
  if (amountCelo > maxCelo) {
    return { valid: false, error: `Maximum wager is ${maxCelo} CELO` };
  }
  return { valid: true };
}

// ─── Question Submission ─────────────────────────────────────────────────────

/**
 * Validate a question contribution submission.
 */
export function validateQuestion(q: {
  question: string;
  answers: string[];
  correctIndex: number;
}): ValidationResult {
  if (!q.question.trim()) {
    return { valid: false, error: "Question text is required" };
  }
  if (q.question.trim().length < 10) {
    return { valid: false, error: "Question must be at least 10 characters" };
  }
  if (q.answers.length < 2 || q.answers.length > 4) {
    return { valid: false, error: "Provide 2–4 answer choices" };
  }
  const empty = q.answers.findIndex((a) => !a.trim());
  if (empty !== -1) {
    return { valid: false, error: `Answer ${empty + 1} is empty` };
  }
  if (q.correctIndex < 0 || q.correctIndex >= q.answers.length) {
    return { valid: false, error: "Select a correct answer" };
  }
  return { valid: true };
}

// ─── URL ─────────────────────────────────────────────────────────────────────

export function validateUrl(value: string): ValidationResult {
  try {
    new URL(value);
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL" };
  }
}
