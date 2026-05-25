# Smart Contract Architecture

DuelSnap smart contracts are written in Solidity and deployed on **Celo Mainnet**.

## Contracts

### `CasualPool.sol`
Manages casual (paid) game sessions with cUSD payments.

- **Entry fee**: configurable per session
- **Royalties**: distributed to photo contributors on every game
- **Withdrawal**: players can claim earnings after session ends

### `GameSession.sol`
Manages 1v1 PvP game sessions.

- **Stake**: both players lock CELO/cUSD on session creation
- **Resolution**: winner claims full pot minus protocol fee
- **Timeout**: session auto-resolves if opponent doesn't respond

## Payment Flow

```
Player → approve(contract, amount) → joinSession(sessionId)
                                           ↓
                                    Contract holds stake
                                           ↓
                                    Game resolves on-chain
                                           ↓
                                    Winner claims pot
                                    Contributors earn royalty
```

## Upgrades

Contracts use the **UUPS (ERC-1967)** upgrade pattern.
Only the contract owner can call `upgradeTo()`.

## Addresses (Celo Mainnet)

| Contract | Address |
|----------|---------|
| CasualPool | See `sc/deployments/` |
| GameSession | See `sc/deployments/` |

## Testing

```bash
cd sc
forge test
forge coverage
```

## Deployment

```bash
cd sc
forge script script/Deploy.s.sol --rpc-url $CELO_RPC --broadcast
```
