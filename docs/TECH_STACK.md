# Tech Stack

Overview of all technologies used in DuelSnap.

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework, SSR, routing |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.x | Animations |

## Blockchain

| Technology | Purpose |
|------------|---------|
| Celo Mainnet | L2 blockchain (EVM-compatible, fast, cheap gas) |
| viem | Low-level Ethereum client |
| wagmi | React hooks for Ethereum |
| MiniPay | Mobile wallet for Celo (Opera Mini) |
| WalletConnect | Multi-wallet connector |

## Smart Contracts

| Technology | Purpose |
|------------|---------|
| Solidity 0.8.x | Contract language |
| Foundry | Build, test, deploy toolchain |
| OpenZeppelin | UUPS upgradeable, ERC-20 interfaces |

## Backend / Infrastructure

| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Serverless API handlers |
| Upstash Redis | Session state, leaderboard cache |
| Pinata / IPFS | Decentralized photo storage |
| Vercel | Frontend hosting + edge functions |

## Dev Tools

| Tool | Purpose |
|------|---------|
| Bun | Package manager + runtime |
| Biome | Linter + formatter |
| TypeScript | Static analysis |
| GitHub Actions | CI/CD |

## Why Celo?

- **Sub-cent gas fees** — players pay almost nothing per transaction
- **cUSD stablecoin** — games priced in stable currency
- **MiniPay integration** — reaches millions of mobile-first users
- **EVM-compatible** — standard Solidity tooling works out of the box
