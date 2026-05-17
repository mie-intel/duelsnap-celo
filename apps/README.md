This is the [Next.js](https://nextjs.org) frontend for DuelPic — a Social-GameFi picture-guessing platform on Base Sepolia.

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
NEXT_PUBLIC_CHAIN_ID=84532
AI_FAILS_AS_ERROR=false
NEXT_PUBLIC_MOCK_IDRX_ADDRESS=0x24C290e0c36661bAf3e2c75832dE591eD11D3bFd
NEXT_PUBLIC_QUESTION_POOL_ADDRESS=0x8189Ae321e79Daf6b7db6e7c2429240A39B730a7
NEXT_PUBLIC_CASUAL_POOL_ADDRESS=0xa3D7411BbC6E44F8e67acA4745c2Cca68fCfe77b
NEXT_PUBLIC_GAME_SESSION_ADDRESS=0x4aC8A9BE144FFfA0cB91dFB481437CCEe75A9F8F
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x24C290e0c36661bAf3e2c75832dE591eD11D3bFd
DEPLOYER_PRIVATE_KEY=....

FAUCET_PRIVATE_KEY=....
NEXT_PUBLIC_PRIVY_APP_ID=....
GEMINI_API_KEY=....
UPSTASH_REDIS_REST_URL=https://musical-gibbon-104311.upstash.io
UPSTASH_REDIS_REST_TOKEN=....
PRIVY_APP_SECRET=....
```

## Tech Stack

- **Framework:** Next.js 16 + App Router
- **Styling:** TailwindCSS v4
- **Web3:** wagmi + viem + Privy + Base Account SDK
- **State:** @tanstack/react-query
- **Backend:** Next.js API routes (Node.js)
- **Caching:** Upstash Redis
- **Storage:** IPFS via Pinata
- **AI:** Google Gemini 2.5 Flash
- **Blockchain:** Base Sepolia (EVM)

## Deployment & Smart Contracts

**Live Deployment:** https://duelpic-base.vercel.app

**Smart Contract Addresses (Base Sepolia):**

| Contract                 | Address                                      | Block Explorer                                                                                      |
| ------------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Mock IDRX Token          | `0x24C290e0c36661bAf3e2c75832dE591eD11D3bFd` | [View on BaseScan](https://sepolia.basescan.org/address/0x24C290e0c36661bAf3e2c75832dE591eD11D3bFd) |
| Question Pool            | `0x8189Ae321e79Daf6b7db6e7c2429240A39B730a7` | [View on BaseScan](https://sepolia.basescan.org/address/0x8189Ae321e79Daf6b7db6e7c2429240A39B730a7) |
| Casual Pool              | `0xa3D7411BbC6E44F8e67acA4745c2Cca68fCfe77b` | [View on BaseScan](https://sepolia.basescan.org/address/0xa3D7411BbC6E44F8e67acA4745c2Cca68fCfe77b) |
| Game Session             | `0x4aC8A9BE144FFfA0cB91dFB481437CCEe75A9F8F` | [View on BaseScan](https://sepolia.basescan.org/address/0x4aC8A9BE144FFfA0cB91dFB481437CCEe75A9F8F) |
| Payment Token (Mock USD) | `0x24C290e0c36661bAf3e2c75832dE591eD11D3bFd` | [View on BaseScan](https://sepolia.basescan.org/address/0x24C290e0c36661bAf3e2c75832dE591eD11D3bFd) |

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

Deploy to Vercel with Base Sepolia contract addresses in environment variables.

See parent [README.md](../README.md) for DuelPic overview.
