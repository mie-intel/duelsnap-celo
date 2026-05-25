# Component Authoring Guide

Guidelines for building and maintaining UI components in DuelSnap.

---

## File structure

```
apps/components/
├── ui/                  # Headless, reusable primitives
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── ...
├── game/                # Game-specific components
│   ├── QuestionCard.tsx
│   ├── GameEngine.tsx
│   └── ...
├── landing/             # Landing page sections
└── [feature]/           # Feature-specific components
```

**Rule:** `ui/` components must be generic — no game-specific logic. Game logic belongs in `game/`.

---

## Component template

```tsx
import type { ReactNode } from 'react';

interface MyComponentProps {
  children: ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<MyComponentProps['variant']>, string> = {
  default: 'bg-surface-2 text-text-secondary',
  primary: 'bg-primary/10 text-primary',
};

/**
 * One-line description.
 *
 * @example
 * <MyComponent variant="primary">Content</MyComponent>
 */
export function MyComponent({
  children,
  variant = 'default',
  className = '',
}: MyComponentProps) {
  return (
    <div className={[VARIANT_CLASSES[variant], className].join(' ')}>
      {children}
    </div>
  );
}
```

---

## Design tokens

Always use CSS variables / Tailwind tokens — never hardcode colors.

| Token | Usage |
|-------|-------|
| `bg-bg-page` | Page background |
| `bg-surface-2` | Card/panel background |
| `bg-surface-3` | Input/elevated surface |
| `text-primary` | Brand color text |
| `text-text-primary` | Primary body text |
| `text-text-secondary` | Muted / secondary text |
| `text-text-inverse` | Text on dark/colored backgrounds |
| `bg-primary` | Brand accent fill |
| `bg-success` / `bg-error` | Status colors |

---

## Accessibility checklist

- [ ] Interactive elements use `<button>` or `<a>`, not `<div onClick>`
- [ ] `aria-label` on icon-only buttons
- [ ] `role="alert"` on status messages
- [ ] `aria-pressed` on toggle/selected state
- [ ] `focus-visible:ring-2 focus-visible:ring-primary` on all interactive elements
- [ ] `disabled` prop disables + prevents `active:scale`

---

## Pattern: polymorphic interactive element

Use conditional tag pattern when a component renders as `<button>` or `<span>` based on props:

```tsx
const Tag = onClick ? 'button' : 'span';
return (
  <Tag
    {...(onClick ? { type: 'button', onClick } : {})}
    className="..."
  >
    {children}
  </Tag>
);
```

---

## Variant pattern

Use a record lookup instead of ternary chains:

```tsx
// ✅ Good
const VARIANTS = {
  primary: 'bg-primary text-white',
  ghost: 'text-text-secondary hover:text-text-primary',
};
<div className={VARIANTS[variant]} />

// ❌ Avoid
<div className={variant === 'primary' ? 'bg-primary' : variant === 'ghost' ? '...' : '...'} />
```

---

## Class joining

Join Tailwind classes with array + `.join(' ')` — no `clsx` / `cn` dependency needed for simple cases:

```tsx
className={[
  'base classes',
  VARIANTS[variant],
  size === 'sm' ? 'text-xs' : 'text-sm',
  className,
].join(' ')}
```

---

## Documenting components

Every component in `ui/` must have:
1. JSDoc comment with `@example`
2. Entry in `apps/components/ui/README.md`

See existing components like `Badge.tsx` and `Button.tsx` for reference.
