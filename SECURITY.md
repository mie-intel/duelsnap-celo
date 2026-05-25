# Security Policy

## Supported Versions

| Component | Version | Supported |
|---|---|---|
| Frontend (Next.js app) | latest | ✅ |
| CasualPool contract | V3 (proxy) | ✅ |
| GameSession contract | V3 (proxy) | ✅ |
| QuestionPool contract | V2 (proxy) | ✅ |
| CasualPool V1/V2 impl | — | ❌ superseded |
| GameSession V1/V2 impl | — | ❌ superseded |

All active contracts are UUPS upgradeable proxies on **Celo Mainnet** (Chain ID 42220). Implementation addresses can be updated by the protocol owner in case of critical vulnerability.

## Reporting a Vulnerability

**Do NOT open a public GitHub issue for security vulnerabilities.**

Report privately via GitHub's [Security Advisories](https://github.com/mie-intel/duelsnap-celo/security/advisories/new) feature — this keeps the disclosure confidential until a fix is deployed.

Include in your report:
- Description of the vulnerability
- Affected component (contract address / frontend route)
- Steps to reproduce or proof-of-concept
- Potential impact (fund loss, DoS, data leak, etc.)
- Your preferred contact method

### Response Timeline

| Milestone | Target |
|---|---|
| Acknowledgement | 48 hours |
| Initial assessment | 5 business days |
| Fix deployed (critical) | ASAP, target < 7 days |
| Fix deployed (non-critical) | 30 days |
| Public disclosure | After fix is live |

## Smart Contract Security

### Known Risks

- **Centralization**: The protocol owner can upgrade contracts and change fee parameters. This is a deliberate trade-off during the early phase; governance decentralization is on the [roadmap](./ROADMAP.md).
- **Oracle-free design**: Game results are submitted by the server. A compromised server could submit false results. Mitigation: result submission is limited to the authorized relayer address; all payouts are proportional to submitted scores with no way to exceed the pool balance.
- **IPFS availability**: Question images are stored on IPFS. If a CID becomes unavailable, the game still resolves correctly — only the image display degrades.

### Out of Scope

- Front-running of public game session IDs (sessions are publicly visible on-chain by design)
- Griefing via match abandonment (timeout + refund mechanism handles this)
- Gas cost abuse on free casual (rate-limited off-chain)

## Bug Bounty

There is currently no formal bug bounty program. We will review significant vulnerability reports and recognize contributors in the CHANGELOG.
