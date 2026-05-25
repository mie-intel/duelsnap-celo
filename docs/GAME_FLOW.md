# Game Flow Documentation

Complete flow for DuelSnap game modes — from entry to settlement.

---

## Casual Mode

Casual mode is free-to-play, no wager required. 10 questions, 30s per question.

```
Player opens /casual
  └─▶ CategoryPickerModal
        └─▶ Player selects category + difficulty
              └─▶ GameEngine starts
                    ├─▶ QuestionCard renders Q1 with TimerBar
                    │     ├─▶ Player selects answer → score calculated
                    │     │     └─▶ QuestionCard shows result feedback (1.5s)
                    │     └─▶ Timer expires → wrong answer recorded
                    ├─▶ ... Q2–Q10
                    └─▶ GameResults / GameResultsV2 shown
                          ├─▶ ScoreHero: final score
                          ├─▶ RewardBreakdown: XP earned
                          ├─▶ QuestionBreakdown: per-question review
                          ├─▶ ShareButtons: share result
                          └─▶ RematchCTA: play again
```

### Score Formula
```
Score per question = BASE_CORRECT (500) + TIME_BONUS (0–500)
TIME_BONUS = 500 × (1 - elapsed / 30_000)
```

---

## Ranked Duel Mode

Wagered 1v1 match. Both players answer same questions simultaneously.

```
Player opens /play
  └─▶ MatchmakingWidget
        ├─▶ MatchmakingIdle: WagerPicker + Play button
        │     └─▶ Player sets wager → clicks "Find Duel"
        ├─▶ MatchmakingSearching: looking for opponent
        │     ├─▶ Match found → MatchmakingFound (opponent card)
        │     │     └─▶ Smart contract: lock stakes → GameEngine starts
        │     └─▶ Timeout (60s) → MatchmakingTimeout → refund
        └─▶ GameEngine (same as casual, both players in parallel)
              └─▶ GameResults
                    ├─▶ Winner: +stake claim
                    └─▶ Loser: -stake
```

### On-Chain Settlement
1. Both players call `joinMatch(matchId, stake)` → CELO locked in contract
2. After last question, frontend calls `submitResult(matchId, score)`
3. Contract compares scores → transfers stake to winner
4. Disputed results → contract uses signed score from server

---

## Question Contribution

Players can submit new questions for community review.

```
/contribute page
  └─▶ ContributionForm
        ├─▶ Upload image (Pinata IPFS)
        ├─▶ Enter question + 4 answers
        ├─▶ Mark correct answer
        └─▶ Gemini AI: verify question quality
              ├─▶ Pass → submit to contract → XP reward
              └─▶ Fail → show feedback, allow re-edit
```

---

## State Machine (Matchmaking)

```
IDLE → SEARCHING → FOUND → IN_GAME → RESULTS
         ↓              ↓
      TIMEOUT        CANCELLED
```

See `hooks/useMatchmaking.ts` for implementation.

---

## Key Contracts

| Contract | Purpose |
|---|---|
| `CasualPool` | Manages casual game sessions |
| `GameSession` | Handles ranked match staking + settlement |
| `QuestionRegistry` | Stores approved questions on-chain |

See [docs/TECH_STACK.md](TECH_STACK.md) for contract addresses.
