# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Next.js)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Run Prettier on entire codebase
```

No test suite is configured yet.

## Architecture

**Stack**: Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS 4, TanStack Query v5, CVA

**Key directories**:

- `app/` — Next.js pages and layouts (App Router)
- `shared/components/` — Reusable UI components
- `shared/providers/` — Context providers (QueryProvider wraps root layout)
- `shared/lib/` — Utilities (`cn.ts`, `get-query-client.ts`)
- `styles/` — Design system CSS (primitive colors → semantic colors → typography)
- `docs/` — Coding, ESLint, commit, and Git workflow conventions

**Path alias**: `@/*` maps to the project root.

## Design System

Three-layer CSS approach in `styles/`:

1. `primitive-color.css` — Raw color scales (gray, primary, secondary, tertiary)
2. `semantic-color.css` — Named tokens (`--color-text-basic`, `--color-bg-surface`, etc.)
3. `typography.css` — Pretendard font + scale variables (display, heading, body, detail)

**Component variants**: Use CVA (`class-variance-authority`) for variant management. See `shared/components/button.tsx` for the pattern.

**Class merging**: Use `cn()` from `shared/lib/cn.ts` (clsx + tailwind-merge extended with custom token groups). Never use `clsx` or `twMerge` directly.

## Code Conventions (enforced by ESLint + Prettier)

- **No default exports** except Next.js page/layout files
- **Arrow functions** for all React components
- **Type imports** must use `import type { ... }`
- **No `any`** — TypeScript strict mode enforced
- **No `console`** — ESLint error
- Import order: builtin → external → internal → type → index → unknown (alphabetical within groups)
- Prettier: single quotes, semicolons, trailing commas, 120-char print width

## Commits

Conventional Commits format. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`, `design`. Max 72 chars, no trailing period. Enforced by commitlint + Husky.

## React Query Defaults

Configured in `shared/lib/get-query-client.ts`: staleTime 1 min, gcTime 5 min, no retries, throwOnError enabled, no refetchOnWindowFocus.

---

## Clean Code Principles

> Source: `.claude/skills/clean-code.md`

Code should be readable, maintainable, and self-documenting. Functions do one thing; names reveal intent; error handling is deliberate.

### Naming

| Type       | Convention                          | Example                           |
| ---------- | ----------------------------------- | --------------------------------- |
| Boolean    | `is`, `has`, `can`, `should` prefix | `isActive`, `hasPermission`       |
| Function   | Verb + noun                         | `calculateTotal`, `validateEmail` |
| Collection | Plural noun                         | `users`, `orderItems`             |
| Constants  | SCREAMING_SNAKE_CASE                | `MAX_RETRY_COUNT`                 |
| Classes    | PascalCase noun                     | `OrderProcessor`, `UserValidator` |

Never use `data`, `result`, `list`, `temp`, `x`, `handler`, `process` as variable/function names — always name what the value actually represents.

### Function Size

| Lines | Assessment   | Action                       |
| ----- | ------------ | ---------------------------- |
| 1–10  | Excellent    | Keep as is                   |
| 11–20 | Good         | Acceptable                   |
| 21–30 | Questionable | Consider splitting           |
| 31–50 | Too long     | Split into smaller functions |
| 50+   | Critical     | Must refactor                |

### SOLID (Quick Reference)

- **S** — One class/function = one reason to change
- **O** — Extend via new classes, not by modifying existing ones
- **L** — Subtypes must be substitutable for their base types
- **I** — Many specific interfaces over one general interface
- **D** — Depend on abstractions, not concrete implementations

### Error Handling

- Never swallow errors with empty catch or bare `console.log(e)`
- Catch specific exceptions; re-throw unexpected ones
- Preserve stack trace — do not wrap in `new Error("generic message")`

### Comments

Write comments only for WHY, never for WHAT. If a comment explains what the code does, rename or restructure instead.

### Red Flags — Stop and Refactor

| You're about to…                | Ask yourself…                       |
| ------------------------------- | ----------------------------------- |
| Add a 5th parameter             | Should I use a parameter object?    |
| Add line 30+ to a function      | Should I extract a method?          |
| Name a variable `data`/`result` | What does this actually represent?  |
| Write `catch (e) {}`            | What should happen on error?        |
| Write a comment explaining code | Can I rename to make it obvious?    |
| Nest a 4th level of conditions  | Can I use early returns or extract? |

---

## React & Next.js Performance (Vercel Best Practices)

> Source: `.agents/skills/vercel-react-best-practices/` — Full rule details in `rules/` directory.

Rules are prioritized by impact. Apply top-down when writing or reviewing React/Next.js code.

### 1. Eliminating Waterfalls — CRITICAL

- Use `Promise.all()` for independent async operations (`async-parallel`)
- Move `await` into branches where it is actually needed (`async-defer-await`)
- Check cheap sync conditions before awaiting remote values (`async-cheap-condition-before-await`)
- Start promises early, await late in API routes (`async-api-routes`)
- Use Suspense boundaries to stream content progressively (`async-suspense-boundaries`)

### 2. Bundle Size Optimization — CRITICAL

- Import directly from source files, not barrel re-exports (`bundle-barrel-imports`)
- Prefer statically analyzable import paths (`bundle-analyzable-paths`)
- Use `next/dynamic` for heavy components (`bundle-dynamic-imports`)
- Load analytics/logging after hydration (`bundle-defer-third-party`)
- Load feature modules only when the feature is activated (`bundle-conditional`)

### 3. Server-Side Performance — HIGH

- Always authenticate server actions like API routes (`server-auth-actions`)
- Use `React.cache()` for per-request deduplication (`server-cache-react`)
- Hoist static I/O (fonts, logos) to module level (`server-hoist-static-io`)
- Never use module-level mutable state in RSC/SSR (`server-no-shared-module-state`)
- Minimize data serialized into client component props (`server-serialization`)
- Restructure components to parallelize server fetches (`server-parallel-fetching`)

### 4. Client-Side Data Fetching — MEDIUM-HIGH

- Use SWR/TanStack Query for automatic request deduplication (`client-swr-dedup`)
- Deduplicate global event listeners (`client-event-listeners`)
- Use passive listeners for scroll events (`client-passive-event-listeners`)

### 5. Re-render Optimization — MEDIUM

- Don't subscribe to state only used in callbacks (`rerender-defer-reads`)
- Extract expensive work into memoized child components (`rerender-memo`)
- Hoist default non-primitive props to module scope (`rerender-memo-with-default-value`)
- Use primitive values as effect dependencies (`rerender-dependencies`)
- Derive state during render, not in `useEffect` (`rerender-derived-state-no-effect`)
- Use functional `setState` for stable callbacks (`rerender-functional-setstate`)
- Never define components inside other components (`rerender-no-inline-components`)
- Use `startTransition` for non-urgent updates (`rerender-transitions`)

### 6. Rendering Performance — MEDIUM

- Use ternary (`? :`) not `&&` for conditional rendering (`rendering-conditional-render`)
- Hoist static JSX outside components (`rendering-hoist-jsx`)
- Use inline script for client-only data to avoid hydration flicker (`rendering-hydration-no-flicker`)
- Use `useTransition` for loading state over manual booleans (`rendering-usetransition-loading`)

### 7. JavaScript Performance — LOW-MEDIUM

- Build `Map`/`Set` for repeated lookups instead of `.find()` in loops (`js-index-maps`, `js-set-map-lookups`)
- Return early from functions (`js-early-exit`)
- Hoist `RegExp` creation outside loops (`js-hoist-regexp`)
- Combine multiple `filter`/`map` into one loop when possible (`js-combine-iterations`)
- Use `flatMap` to map and filter in one pass (`js-flatmap-filter`)

### 8. Advanced Patterns — LOW

- Don't put `useEffectEvent` results in effect dependency arrays (`advanced-effect-event-deps`)
- Store event handlers in refs for stable references (`advanced-event-handler-refs`)
- Use `useLatest` for stable callback refs (`advanced-use-latest`)
