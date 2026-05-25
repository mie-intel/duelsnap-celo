# API Routes

All API routes are Next.js Route Handlers under `apps/app/api/`.

## Authentication
No API key required for public endpoints. All endpoints are CORS-open for MiniPay WebView compatibility.

---

## Game Routes — `/api/game/`

### `GET /api/game/questions`
Fetch a randomized set of questions for a game session.

**Query params:**
- `count` — number of questions (default: 10)
- `category` — filter by category slug (optional)

**Response:** `{ questions: QuestionItem[] }`

### `POST /api/game/free-complete`
Mark a free game session as complete. Records result to Redis.

**Body:** `{ address, results: QuestionResult[], sessionId }`

### `POST /api/game/casual-track`
Track a paid casual game result after on-chain confirmation.

### `GET /api/game/check`
Check if a game session is still valid (not expired).

---

## Leaderboard Routes — `/api/leaderboard/`

### `GET /api/leaderboard/answers`
Returns leaderboard data — top players by CELO earned.

**Query params:**
- `tab` — `all` | `weekly` (default: `all`)

---

## PvP Routes — `/api/pvp/`

### `POST /api/pvp/create`
Create a new PvP session. Returns session ID.

### `POST /api/pvp/match`
Match two players into a session.

### `GET /api/pvp/session/[id]`
Get PvP session state by ID.

---

## Contribute Routes — `/api/contribute/`

### `POST /api/contribute/upload`
Upload a new photo contribution for review.

### `POST /api/contribute/verify`
Verify a contribution on-chain and record royalty eligibility.

---

## Faucet Route — `/api/faucet/`

> ⚠️ Internal / testnet only. Not for production use.

Drips test CELO to a given address.
