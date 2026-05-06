---
name: folder-architecture
description: Use when creating new features, deciding where a file belongs, reviewing folder structure, or when a domain starts accumulating files in shared/. Use before adding a new page, API route, hook, service, or component to ensure it lands in the right place.
---

# Folder Architecture

## Overview

**Files live next to the code that uses them. Cross-domain code lives in `shared/`.**

This project uses a domain-based architecture on top of Next.js App Router. The `app/` directory owns routing only — no business logic. Each feature domain owns its components, hooks, services, and types in `features/[domain]/`. Code that is genuinely reused across two or more domains belongs in `shared/`.

---

## Canonical Structure

```
app/                            # Routing layer ONLY — no business logic here
  (auth)/                       # Route group (no URL segment)
    login/
      page.tsx
    signup/
      page.tsx
  (main)/
    [domain]/
      [id]/
        page.tsx
      page.tsx
  layout.tsx
  page.tsx

features/                       # One folder per domain
  [domain]/
    components/                 # UI components used only within this domain
    hooks/                      # Hooks used only within this domain
    services/                   # API calls — queries and mutations
    types/                      # Type definitions for this domain
    utils/                      # Pure functions specific to this domain
    index.ts                    # Public API — only export what other domains need

shared/                         # Cross-domain reusables
  components/                   # Generic UI (Button, Input, Modal, etc.)
  hooks/                        # Generic hooks (useControllableState, etc.)
  lib/                          # Utilities (cn, get-query-client, etc.)
  providers/                    # Context providers
  types/                        # Shared type definitions
  assets/                       # Icons, images, fonts
    icons/

styles/                         # Design system CSS
  primitive-color.css
  semantic-color.css
  typography.css
```

---

## Part I: The `app/` Directory

**`app/` is a routing layer, not a feature layer.**

Pages and layouts in `app/` should only:

- Define the route
- Compose feature components
- Pass route params / search params down

```typescript
// ❌ BAD: Business logic inside a page
// app/cocktail/[id]/page.tsx
export default async function CocktailDetailPage({ params }) {
  const res = await fetch(`/api/cocktail/${params.id}`);
  const cocktail = await res.json();

  return (
    <div>
      <h1>{cocktail.name}</h1>
      {cocktail.ingredients.map((i) => (
        <span key={i.id}>{i.name}</span>
      ))}
    </div>
  );
}

// ✅ GOOD: Page delegates to feature component
// app/cocktail/[id]/page.tsx
import { CocktailDetail } from '@/features/cocktail';

export default function CocktailDetailPage({ params }: { params: { id: string } }) {
  return <CocktailDetail cocktailId={params.id} />;
}
```

### Route Groups

Use route groups `(groupName)` to organize routes without affecting URL structure.

```
app/
  (auth)/           # /login, /signup — auth layout
    login/page.tsx
    signup/page.tsx
    layout.tsx      # Auth-specific layout (no header)
  (main)/           # All authenticated routes — main layout
    page.tsx        # /
    cocktail/
      page.tsx      # /cocktail
      [id]/
        page.tsx    # /cocktail/:id
    layout.tsx      # Main layout (with header + nav)
```

---

## Part II: The `features/` Directory

**Each domain is a self-contained module.**

### Domain Folder Structure

```
features/
  cocktail/
    components/
      cocktail-card.tsx
      cocktail-list.tsx
      cocktail-detail.tsx
    hooks/
      use-cocktail-detail.ts
      use-cocktail-list.ts
    services/
      cocktail-queries.ts    # useQuery hooks
      cocktail-mutations.ts  # useMutation hooks
      cocktail-api.ts        # Raw fetch functions
    types/
      cocktail.ts
    utils/
      format-ingredients.ts
    index.ts                 # Public API
```

### The `index.ts` Public API

Only export what other domains or `app/` actually need. Keep internals private.

```typescript
// ❌ BAD: Re-export everything (barrel export anti-pattern)
// features/cocktail/index.ts
export * from './components/cocktail-card';
export * from './components/cocktail-list';
export * from './components/cocktail-detail';
export * from './hooks/use-cocktail-detail';
export * from './services/cocktail-queries';

// ✅ GOOD: Export only the public surface
// features/cocktail/index.ts
export { CocktailDetail } from './components/cocktail-detail';
export { CocktailList } from './components/cocktail-list';
export type { Cocktail } from './types/cocktail';
```

### Cross-Domain Imports

Domains import from other domains only through their `index.ts`. Never reach into internals.

```typescript
// ❌ BAD: Importing from another domain's internals
import { useAuthUser } from '@/features/auth/hooks/use-auth-user';

// ✅ GOOD: Import from the domain's public API
import { useAuthUser } from '@/features/auth';
```

---

## Part III: The `shared/` Directory

**`shared/` is for code used by two or more domains.**

### When to Move Code to `shared/`

```
Is this used in only one domain?
├── YES → Keep it in features/[domain]/
└── NO  → Is it used in 2+ domains?
          ├── YES → Move to shared/
          └── PENDING → Keep in features/ until second usage appears
```

Do not pre-emptively move code to `shared/`. Wait for actual reuse.

### `shared/components/` — Generic UI Only

Components in `shared/components/` must have zero domain knowledge.

```typescript
// ❌ BAD: Domain knowledge inside a shared component
// shared/components/card.tsx
export const CocktailCard = ({ cocktail }: { cocktail: Cocktail }) => { ... };

// ✅ GOOD: Generic, composable
// shared/components/card.tsx
export const Card = ({ title, description, children }: CardProps) => { ... };

// ✅ GOOD: Domain-aware card lives in the domain
// features/cocktail/components/cocktail-card.tsx
import { Card } from '@/shared/components/card';
export const CocktailCard = ({ cocktail }: { cocktail: Cocktail }) => (
  <Card title={cocktail.name} description={cocktail.description} />
);
```

---

## Part IV: Services Layer

**All API calls live in `features/[domain]/services/`.**

Separate data-fetching concerns by responsibility:

| File                    | Responsibility                              |
| ----------------------- | ------------------------------------------- |
| `[domain]-api.ts`       | Raw `fetch` / axios calls, returns raw data |
| `[domain]-queries.ts`   | TanStack Query `useQuery` hooks             |
| `[domain]-mutations.ts` | TanStack Query `useMutation` hooks          |

```typescript
// features/cocktail/services/cocktail-api.ts
export const fetchCocktail = async (id: string): Promise<Cocktail> => {
  const res = await fetch(`/api/cocktails/${id}`);
  if (!res.ok) throw new ApiError(res.status, 'Failed to fetch cocktail');
  return res.json() as Promise<Cocktail>;
};

// features/cocktail/services/cocktail-queries.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCocktail } from './cocktail-api';

export const useCocktailDetail = (id: string) =>
  useQuery({
    queryKey: ['cocktail', id],
    queryFn: () => fetchCocktail(id),
  });
```

---

## Part V: File Placement Decision Guide

| File type                          | Where it belongs                                           |
| ---------------------------------- | ---------------------------------------------------------- |
| Page component                     | `app/[route]/page.tsx`                                     |
| Layout component                   | `app/[route]/layout.tsx`                                   |
| Domain-specific UI component       | `features/[domain]/components/`                            |
| Generic UI component (2+ domains)  | `shared/components/`                                       |
| Domain-specific hook               | `features/[domain]/hooks/`                                 |
| Generic hook (2+ domains)          | `shared/hooks/`                                            |
| API fetch function                 | `features/[domain]/services/[domain]-api.ts`               |
| useQuery / useMutation hook        | `features/[domain]/services/[domain]-queries/mutations.ts` |
| Domain type / interface            | `features/[domain]/types/`                                 |
| Shared type (2+ domains)           | `shared/types/`                                            |
| Pure utility (domain-specific)     | `features/[domain]/utils/`                                 |
| Pure utility (generic, 2+ domains) | `shared/lib/`                                              |
| SVG icon                           | `shared/assets/icons/`                                     |
| Context provider                   | `shared/providers/`                                        |
| Design system CSS                  | `styles/`                                                  |

---

## Part VI: Naming Conventions

| Item              | Convention        | Example                               |
| ----------------- | ----------------- | ------------------------------------- |
| Domain folder     | kebab-case        | `cocktail`, `user-profile`, `bar-map` |
| Component file    | kebab-case        | `cocktail-card.tsx`                   |
| Hook file         | `use-` prefix     | `use-cocktail-detail.ts`              |
| Service file      | `[domain]-api.ts` | `cocktail-api.ts`                     |
| Type file         | kebab-case noun   | `cocktail.ts`, `bar.ts`               |
| Util file         | verb-noun         | `format-ingredients.ts`               |
| Public API barrel | `index.ts`        | `features/cocktail/index.ts`          |

---

## Part VII: Anti-Patterns

| Anti-pattern                            | Problem                                    | Fix                                           |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| Logic in `app/` pages                   | Tight coupling to routing, hard to test    | Move to `features/[domain]/components/`       |
| Importing domain internals from outside | Hidden coupling, refactoring breaks things | Import only from `features/[domain]/index.ts` |
| Pre-emptive `shared/` promotion         | Over-abstraction, unused generalization    | Wait for actual second usage                  |
| Domain logic in `shared/`               | `shared/` gains domain awareness           | Keep domain logic in its domain               |
| Flat `features/` folder                 | Unrelated files mixed together             | Group by domain subdirectory                  |
| `components/` used as a dumping ground  | No clear ownership, grows indefinitely     | Apply domain check before placing             |

---

## Quick Reference

```
New page or route        → app/[route]/page.tsx (delegate to features/)
New UI component         → features/[domain]/components/ (promote to shared/ at 2nd reuse)
New data-fetching hook   → features/[domain]/services/
New custom hook          → features/[domain]/hooks/ (promote to shared/ at 2nd reuse)
New type                 → features/[domain]/types/ (promote to shared/types/ at 2nd reuse)
New utility function     → features/[domain]/utils/ (promote to shared/lib/ at 2nd reuse)
Used in 2+ domains?      → shared/
Owned by routing only?   → app/
```

## Red Flags — Stop and Reconsider Placement

| You're about to…                                    | Ask yourself…                                      |
| --------------------------------------------------- | -------------------------------------------------- |
| Add business logic to `app/page.tsx`                | Should this be in `features/[domain]/components/`? |
| Import `features/auth/hooks/use-auth-user`          | Should I import from `features/auth/index.ts`?     |
| Add a domain-specific component to `shared/`        | Is this actually used in 2+ domains?               |
| Create `features/[domain]/index.ts` with `export *` | Which exports does the outside actually need?      |
| Put an API call directly in a component             | Should this be in `services/[domain]-api.ts`?      |
