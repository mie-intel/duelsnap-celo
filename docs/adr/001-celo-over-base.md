# ADR-001: Celo as Primary Chain

**Status:** Accepted  
**Date:** 2025-05

## Context

DuelSnap needed a blockchain with:
1. Low/predictable gas fees (players pay per game)
2. Stablecoin support (fairness for wager-based games)
3. Mobile-first UX focus
4. Active developer ecosystem

## Decision

Use **Celo** as the primary chain with **cUSD** as the wager currency option alongside native CELO.

## Rationale

| Criterion | Celo | Base | Polygon |
|---|---|---|---|
| Gas fees | ~$0.001 | ~$0.01 | ~$0.003 |
| Stablecoins native | ✅ cUSD, cEUR | ❌ bridged only | ❌ bridged only |
| Mobile SDK | ✅ MiniPay | ⚠️ | ❌ |
| Fee abstraction | ✅ pay in cUSD | ❌ | ❌ |

## Consequences

- **Positive**: Near-zero tx fees make micro-wagers viable
- **Positive**: Fee abstraction with cUSD improves UX for non-crypto users
- **Positive**: MiniPay integration gives access to 4M+ mobile wallet users
- **Negative**: Smaller ecosystem vs Base/Ethereum
- **Negative**: Some EVM tooling needs Celo-specific config
