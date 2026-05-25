# Hooks

Custom React hooks for DuelSnap. All hooks live in `apps/hooks/` — **not** in `apps/app/`.

## Conventions

- File: `useCamelCase.ts`
- Must be `"use client"` if using browser APIs
- SSR-safe: check `typeof window !== "undefined"` before accessing browser globals

---

## Blockchain / Wallet

### `useWallet`
Wallet connection, address, balance, login/logout. Core hook for all on-chain flows.

```ts
const { address, isConnected, isReady, celoBalance, login, logout } = useWallet();
```

### `useCUSDBalance`
Reads the connected wallet's cUSD ERC-20 balance.

```ts
const { balance, formatted, loading } = useCUSDBalance();
```

### `useContractWrite`
Low-level viem-based contract write. Handles gas estimation + tx submission.

### `useContractWriteWagmi`
Wagmi-based contract write with connector abstraction.

### `useReadContractWagmi`
Wagmi-based contract read (static call).

### `useGameSession`
Reads and manages current game session state from the smart contract.

---

## Game

### `usePlayerLog`
Fetches a player's match history and computed stats (wins, total, streak).

```ts
const { entries, stats } = usePlayerLog(address);
```

### `useLeaderboard`
Leaderboard data with tab filtering (all-time / weekly).

```ts
const { entries, loading, error, tab, setTab, refresh } = useLeaderboard(address);
```

### `useMatchmaking`
PvP matchmaking — join queue, wait for opponent, session events.

```ts
const { status, opponentAddress, sessionId, join, cancel } = useMatchmaking();
```

### `useCreatorStats`
Creator/contributor on-chain stats — royalties earned, photos contributed.

### `useCountdown` _(new)_
Countdown timer for game time limits.

```ts
const { remaining, progress, isComplete } = useCountdown({ seconds: 30, onComplete });
```

---

## UI / UX

### `useKeyboardShortcuts` _(new)_
Generic keyboard shortcut map with modifier support.

```ts
useKeyboardShortcuts({ Escape: onClose, 'ctrl+enter': onSubmit });
```

### `useGameShortcuts` _(new)_
Game-specific keyboard bindings (Escape = skip).

### `useCopyToClipboard` _(new)_
Clipboard copy with temporary feedback state.

```ts
const { copied, copy } = useCopyToClipboard();
```

### `useDebounce` _(new)_
Debounced reactive value.

```ts
const debouncedQuery = useDebounce(searchTerm, 300);
```

### `useDebouncedCallback` _(new)_
Stable debounced function reference.

### `useLocalStorage` _(new)_
Persistent state with localStorage. SSR-safe + cross-tab sync.

```ts
const [muted, setMuted] = useLocalStorage('game:muted', false);
```

### `useOnlineStatus` _(new)_
Browser online/offline detection.

```ts
const isOnline = useOnlineStatus();
```

### `useScrollPosition` _(new)_
Window scroll position with direction and progress tracking.

```ts
const { y, isScrolled, isScrollingDown, progress } = useScrollPosition(80);

// Hide nav on scroll down
<nav className={isScrollingDown ? '-translate-y-full' : 'translate-y-0'} />
```

### `usePageVisibility` _(new)_
Detects whether the page is visible or backgrounded (Page Visibility API).

```ts
const isVisible = usePageVisibility();

// Pause game timer when user tabs away
useEffect(() => {
  if (!isVisible) pauseTimer();
  else resumeTimer();
}, [isVisible]);
### `useInterval` _(new)_
Declarative `setInterval`. Supports nullable delay to pause.

```ts
// Poll leaderboard every 5s, pause when tab is hidden
const isVisible = usePageVisibility();
useInterval(fetchLeaderboard, isVisible ? 5000 : null);
```

### `useTimeout` _(new)_
Declarative `setTimeout` with imperative `set` / `clear` controls.

```ts
const { set: showBanner, clear: dismiss } = useTimeout(() => setVisible(false), 3000);
### `useEventListener` _(new)_
Typed, ref-fresh DOM event listener. Auto-removes on unmount.

```ts
// Global keyboard shortcut
useEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
}, document);

// Window resize
useEventListener('resize', debounce(handleResize, 100));
```

### `useHover` _(new)_
Tracks hover state on a DOM element via a ref.

```ts
const { ref, isHovered } = useHover<HTMLButtonElement>();
<button ref={ref} className={isHovered ? 'ring-2 ring-primary' : ''}>
  Hover
</button>
```

### `useBaseAccountCapabilities`
Checks Base Account (smart wallet) capabilities for fee abstraction.

## useLocalStorage

SSR-safe localStorage with JSON serialization and cross-tab sync.

```ts
const [theme, setTheme, removeTheme] = useLocalStorage("theme", "dark");
```
