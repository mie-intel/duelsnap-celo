# DuelSnap

Picture-guessing PvP game on Celo Mainnet. Players duel 1v1 with CELO wagers.

## Contract Addresses (Celo Mainnet)

| Contract | Address |
|---|---|
| QuestionPool | `0x9F80612d1621a92D2F14B4246BDAea33CFAb51d6` |
| CasualPool | `0x839fdf32e45A116EeFcFE3b1C4F892056057465c` |
| GameSession | `0xBf63ace11D191102D9655aE2F067Ce485289881E` |

Explorer: https://celoscan.io

## Game Modes

- **Free Casual** — 3 free games/day
- **Paid Casual** — 0.01 CELO/game, 90% royalties to question contributors
- **PvP** — 1v1 wager (user-defined CELO amount), 87% to winner, 10% to contributors, 3% treasury

## Stack

- Smart Contracts: Solidity 0.8.28, Foundry, OpenZeppelin UUPS upgradeable
- Frontend: Next.js, Wagmi, Privy, Viem
- Storage: IPFS (Pinata), Upstash Redis
- Chain: Celo Mainnet (ID: 42220)

## Dev

```bash
# Frontend
cd apps && pnpm install && pnpm dev

# Contracts
cd sc && forge build
cd sc && forge test
```
