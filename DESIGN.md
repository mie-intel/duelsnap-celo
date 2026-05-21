# DuelSnap — Design System

Last updated: 2026-05-20

## New Sections Added (2026-05-20)
- Leaderboard page (`/leaderboard`) — PRs #90–#102
- Matchmaking UI (play page PvP card) — PRs #103–#113

## Aesthetic Direction

**Retro-futuristic dark gaming** — deep void purple background, Celo green + gold accents, high-contrast typography. Feels like a premium crypto game, not a generic DeFi dashboard.

DESIGN_VARIANCE: 8 · MOTION_INTENSITY: 6 · VISUAL_DENSITY: 4

---

## Color Tokens

| Token | Value | Use |
|---|---|---|
| `--color-bg-page` | `#0F001F` | Page background (deep void purple) |
| `--color-bg-card` | `#1A0030` | Card surfaces |
| `--color-primary` | `#35D07F` | Celo green — primary CTA, success, free mode |
| `--color-primary-dark` | `#25A060` | Hover state for primary |
| `--color-secondary` | `#FBCC5C` | Celo gold — paid mode, CELO amounts |
| `--color-accent-pvp` | `#FF4D4D` | PvP ranked — wager, danger, energy |
| `--color-text-primary` | `#F8F3EB` | Body text (warm white, not pure #FFF) |
| `--color-text-secondary` | `rgba(248,243,235,0.55)` | Muted text |
| `--color-text-inverse` | `#0F001F` | Text on green buttons |
| `--color-glow-green` | `rgba(53,208,127,0.18)` | Ambient hero glow |
| `--color-glow-gold` | `rgba(251,204,92,0.15)` | Ambient hero glow |
| `--color-border-subtle` | `rgba(248,243,235,0.08)` | Dividers, card borders |
| `--color-border-mid` | `rgba(248,243,235,0.15)` | Hover borders, badges |
| `--color-surface-1` | `rgba(255,255,255,0.04)` | Glass card bg |
| `--color-surface-2` | `rgba(255,255,255,0.07)` | Glass card hover bg |

---

## Typography

| Role | Font | Class |
|---|---|---|
| Display / Headers | Space Grotesk | `font-display` |
| Body / UI | Outfit | `font-sans` |
| Monospace / Numbers | JetBrains Mono | `font-mono` |

Loaded via Google Fonts in `layout.tsx`.

Hero H1: `text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95]`
H2: `text-3xl md:text-5xl tracking-tight`
Body: `text-base leading-relaxed max-w-[65ch]`
Eyebrow: `text-xs uppercase tracking-widest font-bold`

---

## Layout

- **Max content width:** `max-w-[1400px] mx-auto px-6 md:px-10`
- **Hero:** 50/50 split grid, content left / game card right
- **Features:** divide-y rows (not 3 equal cards)
- **Section spacing:** `py-24 md:py-32`
- **Mobile:** All grids collapse to `grid-cols-1 px-6`
- **Never `h-screen`** — always `min-h-[100dvh]`

---

## Component Patterns

### Cards
- Radius: `rounded-[2rem]` (distinctive, not default `rounded-2xl`)
- Border: `border border-[var(--color-border-subtle)]`
- Background: `bg-[var(--color-surface-1)]`
- Hover: `hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border-mid)]`

### Buttons (primary)
- `px-7 py-3.5 rounded-full bg-primary text-text-inverse font-bold`
- Min height: `min-h-[48px]` (landing) / `min-h-[44px]` (app)
- Focus: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`

### Section eyebrows
- `text-xs font-bold uppercase tracking-widest text-primary`
- `SectionLabel` component in `components/landing/`

---

## Animations

- **Hero entrance:** `heroFadeUp` keyframe with 5 stagger classes (`.hero-fade-1` → `.hero-fade-5`)
- **Live pulse dot:** `livePulse` keyframe on eyebrow badge
- **Scroll reveal:** `FadeIn` component using `IntersectionObserver`
- **Glow orbs:** `AnimatedGlow` component using RAF for breathing effect
- **All animations:** disabled via `prefers-reduced-motion: reduce`

---

## Z-index System

```
--z-sticky-nav: 30
--z-dropdown: 40
--z-overlay: 50
--z-modal: 60
--z-toast: 70
```

---

## Landing Page Structure

```
/ (LandingPage)
├── LandingNav      — sticky top, frosted glass on scroll
├── HeroSection     — split layout, game card mock
├── StatsSection    — 4-col metrics strip
├── HowItWorksSection — 3-step divided grid
├── GameModesSection  — 3 mode cards
├── EarnSection     — split, sticky copy, divide-y streams
├── ContributeSection — royalty breakdown
├── CeloSection     — Celo network features
├── FAQSection      — accordion
├── CTASection      — full-width card with glow
└── LandingFooter
```

**Note:** Bottom `NavBar` is hidden on `/` — landing has its own top nav.

---

## File Locations

- Design tokens: `apps/app/globals.css`
- Landing components: `apps/components/landing/`
- App layout: `apps/app/layout.tsx`
- Fonts loaded in: `apps/app/layout.tsx` (Google Fonts link)
