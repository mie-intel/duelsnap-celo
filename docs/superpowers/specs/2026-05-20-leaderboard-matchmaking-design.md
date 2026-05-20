# Leaderboard + Matchmaking UI — Design Spec

Date: 2026-05-20  
Aesthetic: Retro-futuristic dark gaming (per DESIGN.md)  
SC changes: None. Pure frontend + Redis reads.

---

## 1. Leaderboard Page (`/leaderboard`)

### Data Layer
- Upstash Redis sorted set: `leaderboard:global`, `leaderboard:weekly`
- Score = total CELO winnings (in wei)
- API route: `GET /api/leaderboard?tab=global|weekly`
- Each entry: `{ rank, address, score, wins, losses, winRate, change }`

### Components
| Component | Purpose |
|-----------|---------|
| `RankBadge` | Gold/silver/bronze medals for #1-3, numbered for rest |
| `LeaderboardRow` | Single player row: rank + address + stats + CELO |
| `PodiumSection` | Top 3 cinematic display with crown glow |
| `LeaderboardTabs` | Global / Weekly switcher |
| `LeaderboardSkeleton` | Layout-matching loading state with shimmer |
| `RankChangeIndicator` | ↑3 green / ↓2 red arrow badge |
| `PlayerHighlightRow` | Sticky bottom: current user rank |
| Empty/Error states | Inline, no spinner-only fallbacks |

### Animation
- Staggered row entrance: `staggerChildren: 0.06`
- PodiumSection: dramatic spring reveal per tier
- RankChange: color + translate spring on data update
- Skeleton: shimmer loop (linear, isolated component)

### Layout
- Mobile: single column list, sticky PlayerHighlightRow at bottom
- Desktop: 2-col (leaderboard table left, stats panel right)

---

## 2. Matchmaking UI

### State Machine
```
idle → searching → found → countdown → [game start]
                ↓
           connection_lost → idle (retry)
```

### States
| State | UI | Duration |
|-------|-----|---------|
| `idle` | WagerPicker + "Find Opponent" button | — |
| `searching` | Pulsing radar SVG + elapsed timer + cancel | 3–8s simulated |
| `found` | OpponentCard spring slide-in | 2s auto-advance |
| `countdown` | 3 → 2 → 1 → FIGHT! fullscreen | 3s |
| `connection_lost` | Timeout message + retry | — |

### Components
| Component | Purpose |
|-----------|---------|
| `useMatchmaking` | State machine hook + simulated delays |
| `MatchmakingModal` | Full overlay container, AnimatePresence |
| `WagerPicker` | 0.1 / 0.5 / 1.0 CELO selector |
| `MatchmakingSearching` | Pulsing radar + cancel + elapsed |
| `OpponentCard` | Truncated address, mock stats, ready badge |
| `MatchmakingFound` | Opponent slide-in overlay |
| `MatchmakingCountdown` | Cinematic 3-2-1 with scale spring |
| `MatchmakingTimeout` | Connection lost + retry button |

### Hook (`useMatchmaking`)
```ts
type MatchState = 'idle' | 'searching' | 'found' | 'countdown' | 'connection_lost';
interface MatchmakingState {
  state: MatchState;
  wager: number;
  opponent: OpponentInfo | null;
  elapsed: number;
  startSearch: (wager: number) => void;
  cancel: () => void;
  retry: () => void;
}
```

### Animation
- Modal: `AnimatePresence` with fade+scale
- State transitions: spring slide (y: 20 → 0, opacity: 0 → 1)
- Countdown number: scale 2.5 → 1, spring dramatic
- Radar: perpetual scale pulse (memoized component)
- Exit: spring exit per state (`exit={{ opacity: 0, scale: 0.95 }}`)

---

## PR Breakdown (24 total)

### Leaderboard (13 PRs)
1. `feat/leaderboard-page-scaffold` — route + layout shell + nav link
2. `feat/leaderboard-rank-badge` — RankBadge component
3. `feat/leaderboard-row` — LeaderboardRow component
4. `feat/leaderboard-podium` — PodiumSection top 3
5. `feat/leaderboard-redis-schema` — Redis schema + GET API route
6. `feat/leaderboard-hook` — useLeaderboard hook
7. `feat/leaderboard-tabs` — Global/Weekly tabs
8. `feat/leaderboard-skeleton` — shimmer skeleton
9. `feat/leaderboard-rank-change` — RankChangeIndicator
10. `feat/leaderboard-entrance-anim` — Framer Motion staggered rows
11. `feat/leaderboard-player-highlight` — sticky current user row
12. `feat/leaderboard-empty-error` — empty + error states
13. `feat/leaderboard-desktop-layout` — 2-col desktop layout

### Matchmaking (11 PRs)
14. `feat/matchmaking-state-types` — types + useMatchmaking hook
15. `feat/matchmaking-modal-shell` — MatchmakingModal overlay
16. `feat/matchmaking-wager-picker` — WagerPicker component
17. `feat/matchmaking-idle-state` — idle UI
18. `feat/matchmaking-searching-state` — radar + cancel + timer
19. `feat/matchmaking-opponent-card` — OpponentCard component
20. `feat/matchmaking-found-state` — found overlay + spring
21. `feat/matchmaking-countdown-state` — 3-2-1 cinematic
22. `feat/matchmaking-timeout-state` — connection lost + retry
23. `feat/matchmaking-play-integration` — integrate into play page
24. `feat/matchmaking-exit-animations` — spring exit per state
