# Contributing to DuelSnap

Welcome! This guide covers how to contribute code, components, and docs to DuelSnap.

---

## Getting started

1. Fork the repo and clone your fork
2. Follow [LOCAL_DEV.md](./LOCAL_DEV.md) to set up your environment
3. Create a feature branch from `master`:
   ```bash
   git checkout -b feat/<short-description>
   ```

---

## Branch naming

| Prefix | Use |
|--------|-----|
| `feat/` | New feature or component |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code change without behavior change |
| `chore/` | Tooling, deps, config |

---

## Commit style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

# Examples
feat(ui): add Alert component
fix(hooks): prevent stale closure in useInterval
docs(api): document matchmaking endpoints
```

**Scopes:** `ui`, `hooks`, `lib`, `game`, `api`, `sc`, `docs`, `landing`

---

## Pull requests

- One PR per feature/fix — keep diffs focused
- Link related issues with `Closes #<number>`
- PRs must target `master`
- Fill in the PR template (auto-loaded on GitHub)

---

## Code standards

### TypeScript
- All new code must be typed — no `any` without a comment explaining why
- Prefer `interface` over `type` for object shapes
- Export named exports, not default exports from `lib/` and `hooks/`

### React / Next.js
- Add `"use client"` only when using browser APIs or React hooks
- Hooks go in `apps/hooks/` — never inside `app/`
- Follow existing component patterns — see `apps/components/ui/` for examples

### Tailwind
- Use design tokens from `globals.css` — avoid hardcoded colors
- Tokens: `bg-bg-page`, `text-primary`, `bg-surface-2`, `text-text-secondary`, etc.

---

## Adding a UI component

1. Create `apps/components/ui/MyComponent.tsx`
2. Export as named export: `export function MyComponent(...)`
3. Add JSDoc with `@example` showing at least one usage
4. Document in `apps/components/ui/README.md`

```tsx
/**
 * Short description.
 *
 * @example
 * <MyComponent variant="primary">Label</MyComponent>
 */
export function MyComponent({ children }: Props) {
  return <div>{children}</div>;
}
```

---

## Adding a hook

1. Create `apps/hooks/useMyHook.ts`
2. Add `"use client"` if it uses browser APIs
3. Export as named export
4. Include JSDoc + `@example`
5. Document in `apps/hooks/README.md`

---

## Smart contracts

Smart contract changes require extra care — see [`sc/README.md`](../sc/README.md) before modifying anything in `sc/`.

---

## Questions

Open a GitHub Discussion or ping the team on Discord.
