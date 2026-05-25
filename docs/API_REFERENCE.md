# API Reference

DuelSnap Next.js API routes. All routes use the Next.js App Router (`app/api/`).

---

## Leaderboard

### `GET /api/leaderboard`

Returns top players sorted by XP.

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `period` | `all-time` \| `weekly` \| `daily` | `all-time` | Time window |
| `limit` | `number` | `50` | Max entries (max 100) |
| `offset` | `number` | `0` | Pagination offset |

**Response `200`:**
```json
{
  "entries": [
    {
      "rank": 1,
      "address": "0xabc...",
      "displayName": "Alice",
      "xp": 4500,
      "wins": 23,
      "losses": 8,
      "accuracy": 82,
      "rankChange": 2
    }
  ],
  "total": 1240,
  "period": "all-time",
  "updatedAt": 1716000000
}
```

**Errors:**
- `400` — invalid period value
- `500` — Redis connection failure

---

## Faucet

### `POST /api/faucet`

Sends test CELO to an Alfajores address (testnet only).

**Body:**
```json
{ "address": "0xabc..." }
```

**Response `200`:**
```json
{ "txHash": "0x..." }
```

**Errors:**
- `400` — invalid address
- `429` — rate limited (1 request per address per 24h)
- `500` — faucet wallet error

**Notes:**
- Only available on Alfajores (returns 403 on mainnet)
- Rate limited per address via Redis

---

## Authentication / Sessions

DuelSnap uses **wallet-based authentication** — no traditional auth tokens.

Player identity = wallet address. All game actions are signed on-chain.

---

## Redis Cache Keys

Internal Redis keys used by API routes:

| Key | TTL | Description |
|---|---|---|
| `lb:all-time` | 30s | All-time leaderboard snapshot |
| `lb:weekly` | 30s | Weekly leaderboard snapshot |
| `lb:daily` | 30s | Daily leaderboard snapshot |
| `faucet:{address}` | 24h | Rate limit marker |
| `player:{address}` | 5m | Player stats cache |

---

## Error Response Shape

All errors return:
```json
{ "error": "Human-readable message" }
```

Status codes follow HTTP semantics (400 client, 500 server).
