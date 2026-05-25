# Changelog

All notable changes to DuelSnap are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- Toast notification system with celebration type for win events
- Onboarding wizard with step-by-step wallet connect + deposit flow
- Category picker modal for filtered casual games
- Profile V2 with achievement badges, streak calendar, win-rate donut, match history

### Changed
- Improved leaderboard empty states with animated illustrations

---

## [v3.0.0] — 2025-05-10

### Added
- **cUSD payment support** — Paid Casual and PvP wagers now accept cUSD (Celo Dollar) stablecoin in addition to native CELO
- `CasualPoolV3` — upgraded CasualPool via UUPS proxy; adds `playWithCUSD()` entry point
- `GameSessionV3` — upgraded GameSession via UUPS proxy; adds `createSessionWithCUSD()` and `joinSessionWithCUSD()`
- Auto-sign badge showing when Base Account Capabilities are active
- `useCUSDBalance` hook for real-time cUSD balance display
- Network guard component to block play on wrong chain

### Changed
- PvP lobby wager picker now shows CELO / cUSD toggle
- Matchmaking modal wires through cUSD join path
- `useContractWriteWagmi` refactored for cleaner error propagation

### Fixed
- Timer bar animation desync on slow connections
- Mobile viewport overflow on QuestionCard component

---

## [v2.0.0] — 2025-03-22

### Added
- **PvP Ranked mode** — 1v1 on-chain duels with custom CELO wager
- `GameSessionV2` contract — manages session lifecycle, wager escrow, result finalization
- Matchmaking system with radar-pulse animation and timeout handling
- PvP lobby page with wager picker (0.05 / 0.1 / 0.5 CELO)
- On-chain leaderboard with weekly + global tabs, podium section, rank-change indicators
- Desktop sidebar navigation
- SwipeNav for mobile tab switching

### Changed
- `CasualPoolV2` — upgraded pool for improved royalty distribution math
- Question pool answer hashing moved on-chain for tamper resistance
- Landing page redesigned with animated hero, rolling stats counters, tilt cards

### Fixed
- Royalty distribution rounding error on pools with < 10 contributors
- Session finalization gas estimate overflow on long match durations

---

## [v1.0.0] — 2025-01-15

### Added
- **Free Casual mode** — up to 3 free games per day, wallet-optional
- **Paid Casual mode** — 0.01 CELO entry fee, 90% royalties to contributors
- `CasualPool` and `QuestionPool` contracts (Celo Mainnet, UUPS upgradeable)
- IPFS question storage via Pinata
- MiniPay-compatible wallet flow (Opera browser auto-connect)
- Question contribution tab with AI verification
- Activity feed showing recent on-chain games
- Basic leaderboard (global only)
- XP system and game result screen

---

[Unreleased]: https://github.com/mie-intel/duelsnap-celo/compare/v3.0.0...HEAD
[v3.0.0]: https://github.com/mie-intel/duelsnap-celo/compare/v2.0.0...v3.0.0
[v2.0.0]: https://github.com/mie-intel/duelsnap-celo/compare/v1.0.0...v2.0.0
[v1.0.0]: https://github.com/mie-intel/duelsnap-celo/releases/tag/v1.0.0
