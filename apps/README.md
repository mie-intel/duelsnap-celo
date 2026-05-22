This is the [Next.js](https://nextjs.org) frontend for DuelSnap — a MiniPay-ready picture-guessing PvP game on Celo Mainnet.

## Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- Environment variables configured (see `.env.local`)

### Installation & Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

The app auto-updates as you edit files in `app/`, `components/`, and `hooks/`.

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_CHAIN_ID=42220
AI_FAILS_AS_ERROR=false
NEXT_PUBLIC_QUESTION_POOL_ADDRESS=0x9F80612d1621a92D2F14B4246BDAea33CFAb51d6
NEXT_PUBLIC_CASUAL_POOL_ADDRESS=0x839fdf32e45A116EeFcFE3b1C4F892056057465c
NEXT_PUBLIC_GAME_SESSION_ADDRESS=0xBf63ace11D191102D9655aE2F067Ce485289881E
NEXT_PUBLIC_CUSD_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a

NEXT_PUBLIC_PRIVY_APP_ID=....
GEMINI_API_KEY=....
UPSTASH_REDIS_REST_URL=https://musical-gibbon-104311.upstash.io
UPSTASH_REDIS_REST_TOKEN=....
PRIVY_APP_SECRET=....
```

## Tech Stack

- **Framework:** Next.js 16 + App Router
- **Styling:** TailwindCSS v4
- **Web3:** wagmi + viem + Privy + MiniPay-compatible Celo wallets
- **State:** @tanstack/react-query
- **Backend:** Next.js API routes (Node.js)
- **Caching:** Upstash Redis
- **Storage:** IPFS via Pinata
- **AI:** Google Gemini 2.5 Flash
- **Blockchain:** Celo Mainnet (EVM)

## Deployment & Smart Contracts

**Live Deployment:** https://duelsnap-celo.vercel.app

**Smart Contract Addresses (Celo Mainnet):**

| Contract | Address | Block Explorer |
| --- | --- | --- |
| Question Pool | `0x9F80612d1621a92D2F14B4246BDAea33CFAb51d6` | [View on CeloScan](https://celoscan.io/address/0x9F80612d1621a92D2F14B4246BDAea33CFAb51d6) |
| Casual Pool | `0x839fdf32e45A116EeFcFE3b1C4F892056057465c` | [View on CeloScan](https://celoscan.io/address/0x839fdf32e45A116EeFcFE3b1C4F892056057465c) |
| Game Session | `0xBf63ace11D191102D9655aE2F067Ce485289881E` | [View on CeloScan](https://celoscan.io/address/0xBf63ace11D191102D9655aE2F067Ce485289881E) |
| cUSD | `0x765DE816845861e75A25fCA122bb6898B8B1282a` | [View on CeloScan](https://celoscan.io/address/0x765DE816845861e75A25fCA122bb6898B8B1282a) |

## Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run Biome linter
npm run format        # Format code with Biome
npm run seed          # Seed questions from seed-data/
```

## Deployment

Deploy to Vercel with Celo Mainnet contract addresses in environment variables.

See parent [README.md](../README.md) for DuelSnap overview.
