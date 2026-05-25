# lib

Pure, SSR-safe utility modules for DuelSnap.

---

## `constants.ts`

Single source of truth for all magic numbers and config values.

```ts
import {
  QUESTIONS_PER_GAME,
  QUESTION_TIME_LIMIT_SECONDS,
  MIN_STAKE_CUSD,
  MAX_STAKE_CUSD,
  getRankTier,
} from '@/lib/constants';

const tier = getRankTier(750); // { label: "Gold", ... }
```

| Category | Constants |
|----------|-----------|
| Game rules | `QUESTIONS_PER_GAME`, `QUESTION_TIME_LIMIT_SECONDS`, `ANSWER_OPTIONS_COUNT` |
| Stakes | `MIN_STAKE_CUSD`, `MAX_STAKE_CUSD`, `DEFAULT_STAKE_CUSD`, `PLATFORM_FEE_PCT` |
| Matchmaking | `MATCHMAKING_POLL_INTERVAL_MS`, `MATCHMAKING_TIMEOUT_MS` |
| Leaderboard | `LEADERBOARD_PAGE_SIZE`, `LEADERBOARD_REFRESH_INTERVAL_MS` |
| Rank tiers | `RANK_TIERS`, `getRankTier(score)` |
| UI timings | `NEXT_QUESTION_DELAY_MS`, `COPY_FEEDBACK_DELAY_MS` |

---

## `format.ts`

Formatting utilities for numbers, CELO amounts, addresses, and dates.

```ts
import { formatCompact, formatCUSD, formatAddress } from '@/lib/format';

formatCompact(1_234_567)      // "1.2M"
formatCUSD(0.5)               // "0.50 cUSD"
formatAddress("0xabc...def")  // "0xabc...def" (truncated)
import { formatCompact, formatCUSD, formatAddress, formatDate } from '@/lib/format';

formatCompact(1_234_567)       // "1.2M"
formatCUSD(0.5)                // "0.50 cUSD"
formatAddress("0xabc...def")   // "0xabc...def" (truncated)
formatDate(new Date())         // "May 25, 2026"
```

---

## `validation.ts`

Input validation utilities returning typed `{ valid, error? }` result objects.

```ts
import {
  validateAddress,
  validateStake,
  validateUsername,
  validateRequired,
  validateAll,
} from '@/lib/validation';

// EVM address
validateAddress("0xabc123...")   // { valid: true }

// Stake amount against user balance
validateStake(0.5, userBalance)  // { valid: true }
validateStake(0, userBalance)    // { valid: false, error: "Minimum stake is 0.01 cUSD" }

// Username
validateUsername("duel_player1") // { valid: true }

// Chain multiple validators
const result = validateAll([
  validateRequired(name, 'Name'),
  validateUsername(name),
]);
```

| Function | Purpose |
|----------|---------|
| `validateAddress` | EVM address format check |
| `validateTxHash` | Transaction hash format check |
| `validateStake` | cUSD stake range + balance check |
| `validateUsername` | 3–20 char alphanumeric username |
| `validateRequired` | Non-empty field |
| `validatePositiveInt` | Positive integer with optional max |
| `validateAll` | Run multiple validators, return first failure |

---

## `parseContractError.ts`

Parses viem/wagmi contract errors into human-readable messages.

```ts
import { parseContractError } from '@/lib/parseContractError';
const message = parseContractError(error);
```

---

## `chains.ts`

Celo chain config for viem / wagmi.

```ts
import { celo, chains } from '@/lib/chains';
```
