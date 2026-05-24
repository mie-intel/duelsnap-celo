# DuelSnap

MiniPay-ready picture-guessing PvP game on Celo Mainnet. Players can jump into free casual rounds, play paid casual games, or duel 1v1 with CELO wagers while photo contributors earn on-chain royalties.

## Game Modes

| Mode | Cost | Payment | Reward |
|---|---|---|---|
| Free Casual | Free (3×/day) | — | XP only |
| Paid Casual | 0.01 CELO or cUSD | CELO / cUSD | 90% royalties to question contributors |
| PvP Ranked | Custom wager | CELO / cUSD | 87% to winner, 10% contributors, 3% treasury |

## Celo Integration

- **Celo Mainnet** deployment with verified gameplay contracts.
- **MiniPay-ready wallet flow** for mobile-first Celo users.
- **cUSD support** — players can pay for Paid Casual games and PvP wagers using cUSD (Celo Dollar) stablecoin, in addition to native CELO. Powered by CasualPoolV3 and GameSessionV3.
- **On-chain creator economy** where submitted picture questions are stored on IPFS, verified, and rewarded when played.

## Contract Addresses (Celo Mainnet)

### V3 Upgrade Summary

| Contract | Change | New Capability |
|---|---|---|
| CasualPool | V2 → V3 | cUSD payment support for Paid Casual |
| GameSession | V2 → V3 | cUSD wager support for PvP Ranked |
| QuestionPool | No change | — |

| Contract | Proxy | V2 Implementation | V3 Implementation |
|---|---|---|---|
| QuestionPool | [`0x9F80...51d6`](https://celo.blockscout.com/address/0x9F80612d1621a92D2F14B4246BDAea33CFAb51d6) | [`0x08fb...d857`](https://celo.blockscout.com/address/0x08fb84586d1409d690c660afd178e9698437d857?tab=contract) | — |
| CasualPool | [`0x839f...465c`](https://celo.blockscout.com/address/0x839fdf32e45A116EeFcFE3b1C4F892056057465c) | [`0xb011...c8a`](https://celo.blockscout.com/address/0xb0114ef515bf04642d9d2180225f9c2481f61c8a?tab=contract) | [`0x5676...4D3E`](https://celo.blockscout.com/address/0x567653BbDcc353E4B8b0B2527bF249188eF74D3E?tab=contract) |
| GameSession | [`0xBf63...881E`](https://celo.blockscout.com/address/0xBf63ace11D191102D9655aE2F067Ce485289881E) | [`0x9258...d2B`](https://celo.blockscout.com/address/0x92589ca11f6e408d7dca80cf3799184ef837fd2b?tab=contract) | [`0x3b98...d894`](https://celo.blockscout.com/address/0x3b983D839dDa581C73f286B7A495D8E2ba23d894?tab=contract) |

Explorer: [celo.blockscout.com](https://celo.blockscout.com)

> **V3 upgrade**: CasualPool and GameSession contracts were upgraded to V3 via UUPS proxy. V3 adds native cUSD stablecoin payment support alongside CELO, letting players pay for Paid Casual games and PvP wagers in cUSD. Proxy addresses are unchanged — no wallet or frontend reconfiguration required.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  DuelSnap Frontend (Next.js 15)          │
│  /play  /pvp/lobby  /leaderboard  /profile  /activity   │
└────────────────────────┬────────────────────────────────┘
                         │ Wagmi / Viem
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Celo Mainnet (42220)                   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  CasualPool  │  │ GameSession  │  │ QuestionPool  │  │
│  │  (V3 proxy)  │  │  (V3 proxy)  │  │  (V2 proxy)   │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │   CELO / cUSD   │   CELO / cUSD     │ IPFS CID │
└─────────┼─────────────────┼───────────────────┼──────────┘
          │                 │                   │
          ▼                 ▼                   ▼
    Royalty pool       Wager escrow        IPFS (Pinata)
    Contributors       Score relay         Question images
    earn 90%           (server auth)
```

**Request flow (Paid Casual with cUSD):**
1. Player approves CasualPool to spend cUSD (one-time ERC-20 approval)
2. `playCUSD()` — deducts 0.01 cUSD, opens session, emits `SessionStarted`
3. Frontend loads 10 IPFS questions from QuestionPool
4. Player answers; score submitted by authorized relayer
5. `finalizeSession()` — distributes 90% to contributors, 10% treasury

**Request flow (PvP Ranked):**
1. Player A calls `createSession(wager)` — locks CELO/cUSD in escrow
2. Player B calls `joinSession(id)` — matches wager, emits `SessionMatched`
3. Both players answer 10 questions simultaneously
4. Higher scorer wins 87% of 2× wager; 10% to contributors; 3% treasury

## Stack

- **Smart Contracts** — Solidity 0.8.28, Foundry, OpenZeppelin UUPS upgradeable
- **Frontend** — Next.js 15, Wagmi, Privy, Viem
- **Storage** — IPFS via Pinata, Upstash Redis
- **Chain** — Celo Mainnet (Chain ID: 42220), MiniPay-compatible wallet UX
- **Payments** — Native CELO and cUSD (Celo Dollar) stablecoin via ERC-20, supported by V3 contracts

## Project Structure

```
duelsnap-celo/
├── apps/                    # Next.js 15 frontend
│   ├── app/                 # App Router pages
│   │   ├── (game)/casual/   # Casual mode page + client
│   │   ├── (game)/pvp/      # PvP lobby + session pages
│   │   ├── leaderboard/     # On-chain leaderboard
│   │   ├── profile/         # Player profile + stats
│   │   └── activity/        # On-chain activity feed
│   ├── components/          # UI component library
│   │   ├── landing/         # Landing page sections
│   │   ├── game/            # Game engine, question card, results
│   │   ├── matchmaking/     # PvP matchmaking flow
│   │   ├── leaderboard/     # Leaderboard rows, tabs, podium
│   │   ├── profile/         # Profile cards, badges, charts
│   │   ├── onboarding/      # Onboarding wizard steps
│   │   └── ui/              # Shared primitives (Button, Modal, Toast)
│   ├── hooks/               # Wagmi + contract hooks
│   └── lib/                 # Utilities, chain config
└── sc/                      # Foundry smart contracts
    ├── src/                 # Solidity source (CasualPool, GameSession, QuestionPool)
    └── script/              # Deploy + upgrade scripts
```

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- [Foundry](https://getfoundry.sh) (for contract work)
- Node.js ≥ 18

## Setup

```bash
# Clone
git clone https://github.com/mie-intel/duelsnap-celo
cd duelsnap-celo

# Frontend
cd apps
cp .env.example .env.local   # fill in your keys
bun install
bun dev

# Contracts
cd sc
forge install
forge build
forge test
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CELO_RPC_URL` | Celo RPC endpoint |
| `NEXT_PUBLIC_CASUAL_POOL_ADDRESS` | CasualPool proxy address |
| `NEXT_PUBLIC_GAME_SESSION_ADDRESS` | GameSession proxy address |
| `NEXT_PUBLIC_QUESTION_POOL_ADDRESS` | QuestionPool proxy address |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID for wallet auth |

## Contributing

1. Fork the repo
2. Submit picture questions via the in-app **Contribute** tab
3. Questions are AI-verified before going live
4. Earn royalties every time your question is played in Paid Casual or PvP

## License

MIT
