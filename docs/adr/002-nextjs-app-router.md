# ADR-002: Next.js App Router

**Status:** Accepted  
**Date:** 2025-05

## Context

The frontend needed a framework supporting SSR, React Server Components, and fast iteration.

## Decision

Use **Next.js 15** with the **App Router** (not Pages Router).

## Rationale

- Server Components → reduce JS bundle size for landing page
- Streaming + Suspense → better loading UX for on-chain data
- Route handlers → simple API routes for leaderboard/faucet
- Turbopack → fast local dev

## Consequences

- All wallet/web3 components must be `"use client"` — they use browser APIs
- Data fetching patterns differ between server and client components
- Some wagmi/viem hooks only work in client components
