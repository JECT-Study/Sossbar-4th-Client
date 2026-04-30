# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

**Sossbar(소스바)** — 동료 피드백을 데이터화해 개인의 협업 성향과 신뢰도를 보여주는 협업 프로필 서비스.

**핵심 도메인:**

| 도메인       | 설명                                                             |
| ------------ | ---------------------------------------------------------------- |
| `profile`    | 협업 프로필 생성/조회/공유. 후기 기반 태그·뱃지·AI 요약 표시     |
| `review`     | 팀원에게 후기 요청 링크 생성, 문답+태그 선택 기반 후기 작성      |
| `reputation` | 후기 작성 완료율, 평균 후기 수, 프로필 공유 클릭 수 등 지표 집계 |
| `auth`       | 사용자 인증/세션 관리                                            |

**MVP 범위 외 기능** (현재 구현 보류): 협업 태도 뱃지, 프로필 이미지, 평판 요약 이미지 카드, AI 요약.

---

## Commands

```bash
pnpm dev        # Start dev server (Next.js)
pnpm build      # Production build
pnpm lint       # Run ESLint
pnpm format     # Run Prettier on entire codebase
```

No test suite is configured yet.

## Architecture

**Stack**: Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind CSS 4, TanStack Query v5, CVA

**Domain-based folder structure** — full rules in `.claude/skills/folder-architecture.md`:

```
app/          # Routing layer ONLY — pages delegate to features/
features/     # One folder per domain (components, hooks, services, types, utils, index.ts)
shared/       # Cross-domain reusables — promote here only at 2nd actual reuse
styles/       # Design system CSS
```

**Path alias**: `@/*` maps to the project root.

## Design System

Three-layer CSS in `styles/`: `primitive-color.css` → `semantic-color.css` → `typography.css`.

- **Variants**: Use CVA (`class-variance-authority`). See `shared/components/button.tsx` for the pattern.
- **Class merging**: Always use `cn()` from `shared/lib/cn.ts`. Never use `clsx` or `twMerge` directly.

## Code Conventions

Enforced by ESLint + Prettier — violations fail CI:

- **No default exports** except Next.js page/layout files
- **Arrow functions** for all React components
- **Type imports** must use `import type { ... }`
- **No `any`**, **No `console`**
- Import order: builtin → external → internal → type → index → unknown (alphabetical within groups)
- Prettier: single quotes, semicolons, trailing commas, 120-char print width

## Commits

Conventional Commits. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`, `design`. Max 72 chars, no trailing period. Enforced by commitlint + Husky.

## React Query Defaults

Configured in `shared/lib/get-query-client.ts`: staleTime 1 min, gcTime 5 min, no retries, throwOnError enabled, no refetchOnWindowFocus.

---

## Skills & Guidelines

| Topic                                               | Source                                                 |
| --------------------------------------------------- | ------------------------------------------------------ |
| Clean code, naming, SOLID, error handling           | `.claude/skills/clean-code.md`                         |
| Folder architecture, domain placement rules         | `.claude/skills/folder-architecture.md`                |
| React/Next.js performance (40+ rules with examples) | `.agents/skills/vercel-react-best-practices/AGENTS.md` |
