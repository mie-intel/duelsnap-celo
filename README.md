# DuelSnap

Picture-guessing PvP game on Celo Mainnet. Players duel 1v1 with CELO wagers.

## Game Modes

| Mode | Cost | Reward |
|---|---|---|
| Free Casual | Free (3×/day) | XP only |
| Paid Casual | 0.01 CELO | 90% royalties to question contributors |
| PvP Ranked | Custom wager | 87% to winner, 10% contributors, 3% treasury |

## Contract Addresses (Celo Mainnet)

| Contract | Address |
|---|---|
| QuestionPool | `0x9F80612d1621a92D2F14B4246BDAea33CFAb51d6` |
| CasualPool | `0x839fdf32e45A116EeFcFE3b1C4F892056057465c` |
| GameSession | `0xBf63ace11D191102D9655aE2F067Ce485289881E` |

Explorer: [celoscan.io](https://celoscan.io)

## Stack

- **Smart Contracts** — Solidity 0.8.28, Foundry, OpenZeppelin UUPS upgradeable
- **Frontend** — Next.js 15, Wagmi, Privy, Viem
- **Storage** — IPFS via Pinata, Upstash Redis
- **Chain** — Celo Mainnet (Chain ID: 42220)

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
