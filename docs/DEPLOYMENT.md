# Deployment Guide

This document covers deploying DuelSnap to production.

## Prerequisites

- Node.js 20+
- Bun (package manager)
- A Vercel account (or equivalent)
- Celo Mainnet RPC endpoint
- Redis instance (Upstash recommended)
- Pinata account (IPFS storage for photos)

---

## Environment Variables

Create `apps/.env.local` from `apps/.env.example`:

```env
# Celo RPC
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org

# Contract addresses
NEXT_PUBLIC_CASUAL_POOL_ADDRESS=0x...
NEXT_PUBLIC_GAME_SESSION_ADDRESS=0x...

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Pinata (IPFS)
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
PINATA_GATEWAY=https://gateway.pinata.cloud
```

---

## Frontend Deployment (Vercel)

```bash
# 1. Build locally to catch errors
cd apps
bun run build

# 2. Deploy to Vercel
vercel --prod

# Or via GitHub Actions (auto-deploys on push to master)
```

### Vercel Configuration

In `vercel.json`:
- `rootDirectory`: `apps`
- `framework`: `nextjs`
- Set all environment variables in Vercel dashboard

---

## Smart Contract Deployment

```bash
cd sc

# Deploy to Celo Mainnet
forge script script/Deploy.s.sol \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --etherscan-api-key $CELOSCAN_API_KEY

# Update contract addresses in frontend .env
```

### Contract Verification

```bash
forge verify-contract \
  <DEPLOYED_ADDRESS> \
  src/CasualPool.sol:CasualPool \
  --chain-id 42220 \
  --etherscan-api-key $CELOSCAN_API_KEY
```

---

## Post-Deployment Checklist

- [ ] Contract addresses updated in frontend env
- [ ] Redis connection verified
- [ ] Pinata gateway responsive
- [ ] MiniPay origin allowlist updated
- [ ] Celo Mainnet RPC quota checked
- [ ] `vercel env pull` run locally

---

## Monitoring

- **Vercel Analytics**: automatic with Vercel deployment
- **Blockscout**: monitor contract calls at `https://celoscan.io`
- **Upstash**: Redis usage dashboard
