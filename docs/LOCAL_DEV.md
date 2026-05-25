# Local Development Guide

Get DuelSnap running locally in under 5 minutes.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/mie-intel/duelsnap-celo
cd duelsnap-celo/apps

# 2. Install dependencies
bun install

# 3. Copy env template
cp .env.example .env.local
# Fill in values (see DEPLOYMENT.md for reference)

# 4. Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Setup

Minimum required env vars for local dev:

```env
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CASUAL_POOL_ADDRESS=0x...
NEXT_PUBLIC_GAME_SESSION_ADDRESS=0x...
```

For full functionality (contribute, leaderboard persistence):
- Redis: use [Upstash free tier](https://upstash.com)
- Pinata: use free IPFS gateway

---

## Connecting a Wallet

DuelSnap supports:
1. **MiniPay** — use Opera Mini with MiniPay for full mobile experience
2. **MetaMask / Rabby** — standard browser wallet
3. **WalletConnect** — any mobile wallet

Switch your wallet to **Celo Mainnet** (Chain ID: 42220).

---

## Smart Contracts (optional)

To run against a local fork:

```bash
cd sc

# Start local fork of Celo Mainnet
anvil --fork-url https://forno.celo.org

# Deploy to local fork
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast
```

Update `NEXT_PUBLIC_CELO_RPC_URL=http://localhost:8545` in your `.env.local`.

---

## Useful Commands

```bash
# Type checking
bun run type-check

# Linting
bun run lint

# Build production bundle
bun run build

# Smart contract tests
cd sc && forge test -vvv
```

---

## Troubleshooting

**"Transaction failed"**: Check you're on Celo Mainnet and have CELO for gas.

**"Session not found"**: Redis may not be configured. Check `.env.local`.

**Build errors**: Run `bun run type-check` to see TS errors.
