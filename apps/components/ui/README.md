# UI Components

Reusable, headless-friendly UI primitives for DuelSnap.
All components are typed, accessible, and follow the project's Tailwind design tokens.

---

## Primitives

### `Button`
Primary action button with variant + size support.

```tsx
<Button variant="primary" size="lg">Play Now</Button>
<Button variant="outline" size="sm" loading>Confirming...</Button>
```

| Variant | Use |
|---------|-----|
| primary | Main CTA |
| secondary | Secondary action |
| outline | Bordered, less prominent |
| ghost | Text-only, subtle |

---

### `Modal`
Animated full-screen overlay modal.

```tsx
<Modal open={isOpen} onClose={close} title="Confirm action">
  <p>Are you sure?</p>
</Modal>
```

---

### `ConfirmDialog`
Pre-built confirm/cancel modal for destructive actions.

```tsx
<ConfirmDialog
  open={show}
  title="Forfeit duel?"
  description="You'll lose your stake."
  variant="danger"
  confirmLabel="Forfeit"
  onConfirm={forfeit}
  onCancel={() => setShow(false)}
/>
```

---

### `Spinner`
Loading indicator.

```tsx
<Spinner size="sm" />
<Spinner size="lg" />
```

---

### `Card`
Basic card container.

```tsx
<Card className="p-4">Content</Card>
```

---

### `Skeleton`
Animated loading placeholders.

```tsx
<Skeleton className="h-4 w-32" rounded="md" />
<LeaderboardRowSkeleton />
<ActivityEntrySkeleton />
<ProfileStatSkeleton />
<CardSkeleton lines={4} />
```

---

### `Avatar`
User avatar with image or initials fallback.

```tsx
<Avatar address="0xabc..." size="md" />
<Avatar name="Alice" src="/alice.png" size="lg" />
```

---

### `Tooltip`
Hover/focus tooltip.

```tsx
<Tooltip content="Earned on Celo" placement="top">
  <InfoIcon />
</Tooltip>
```

---

### `TxStatus`
On-chain transaction status indicator.

---

### `AutoSignBadge`
Badge shown for auto-sign (Base Account) transactions.

---

### `Chip`
Tag / filter chip for categories, multi-select, or dismissible labels.

```tsx
// Static tag
<Chip variant="primary">Science</Chip>

// Selectable filter chip
<Chip selected={active} onClick={toggle} variant="primary">Sports</Chip>

// Dismissible tag
<Chip dismissible onDismiss={remove}>Geography</Chip>
### `Stepper`
Multi-step progress indicator for onboarding, wizard, and setup flows.

```tsx
const steps = [
  { label: 'Connect Wallet' },
  { label: 'Set Stake', description: 'Choose how much cUSD to wager' },
  { label: 'Find Opponent' },
  { label: 'Play!' },
];

// Horizontal (default)
<Stepper steps={steps} currentStep={1} />

// Vertical
<Stepper steps={steps} currentStep={2} orientation="vertical" />
### `CopyButton`
One-click copy-to-clipboard button with animated check feedback.

```tsx
// Copy wallet address
<CopyButton text={address} label="Copy address" />

// Icon-only
<CopyButton text={txHash} size="icon" />

// Ghost variant
<CopyButton text={referralLink} variant="ghost" label="Copy link" />
```

---

### `Alert`
Inline alert banner for status messages, warnings, or errors.

```tsx
<Alert variant="success" title="Transaction confirmed!">
  Your bet was placed on-chain.
</Alert>
<Alert variant="error" onDismiss={() => setError(null)}>
  Failed to connect wallet.
</Alert>
```

| Variant | Use |
|---------|-----|
| info | General info, tips |
| success | Confirmed actions |
| warning | Caution / attention |
| error | Failures, blocking errors |
---

## Feedback

### `ErrorBoundary`
React error boundary with retry.

```tsx
<ErrorBoundary>
  <UnstableComponent />
</ErrorBoundary>
```

### `ErrorCard`
Inline error card with optional retry button.

```tsx
<ErrorCard message="Failed to load data" onRetry={refetch} />
```

---

## Notifications

### `SoundToggle`
Mute/unmute button tied to `useSoundSettings`.

```tsx
<SoundToggle />
<SoundToggle showLabel />
```

---

## Network

### `OfflineBanner`
Sticky top banner when browser goes offline.

```tsx
// In layout:
<OfflineBanner />
```

---

## Toast system

See `apps/components/ui/toast/` for the full toast system.

```ts
import { useToast } from '../ui/toast';
import { winToast, txConfirmedToast } from '../ui/toast/presets';

const { showToast } = useToast();
showToast(winToast('8/10', '0.5'));
showToast(txConfirmedToast('0xabc...'));
```
