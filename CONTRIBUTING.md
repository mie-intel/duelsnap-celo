# Contributing to DuelSnap

Thanks for helping improve DuelSnap — the on-chain picture duel game on Celo Mainnet.

## Ways to Contribute

### 1. Submit Picture Questions (Biggest Impact)

The fastest way to contribute. Open the **Contribute** tab inside the app, upload a photo, and write the question + four answer options. Your question gets AI-verified and, once live, earns you royalties every time it's played in Paid Casual or PvP modes — forever, on-chain.

**Good question criteria:**
- Clear, unambiguous single correct answer
- Well-lit, recognizable subject
- Categories: landmarks, animals, food, logos, art, science
- Original photo or CC0/public domain image

**Not accepted:**
- People's faces or personally identifiable subjects
- NSFW or violent content
- Copyright-protected imagery (stock photos, movie stills, brand assets)
- Ambiguous answers (e.g., "What color is this?" when multiple answers fit)

### 2. Frontend Improvements

```bash
# Clone and install
git clone https://github.com/mie-intel/duelsnap-celo
cd duelsnap-celo/apps
cp .env.local.example .env.local  # fill in your keys
bun install
bun dev
```

Frontend lives in `apps/`. Stack: Next.js 15, Tailwind CSS, Wagmi, Viem, Framer Motion.

**Good PRs:**
- Accessibility improvements (aria labels, keyboard nav, contrast)
- Mobile UX fixes (touch targets, viewport issues)
- Loading state improvements
- Copy/microcopy polish
- Performance wins (bundle size, image optimization)

### 3. Bug Reports

Open an issue with:
- What you expected vs what happened
- Steps to reproduce
- Browser + wallet + OS
- Console errors if any

### 4. Discussions

For larger ideas (new game modes, tokenomics changes, new integrations), open a GitHub Discussion first before writing code.

## Development Workflow

```bash
# Lint
bun biome check .

# Build
bun build

# Type check
bun tsc --noEmit
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org):

```
feat(component): short description
fix(hooks): short description
docs(readme): short description
chore(deps): short description
polish(ui): short description
```

## Smart Contracts

Smart contracts are **not open for external PRs** at this time. The on-chain logic is audited and upgradeability is controlled by the protocol multisig. If you find a vulnerability, see [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree your code is licensed under [MIT](./LICENSE).
