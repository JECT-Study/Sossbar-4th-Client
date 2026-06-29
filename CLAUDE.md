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

**Domain-based folder structure** — full rules in `.claude/references/folder-architecture.md`:

```
app/          # Routing layer ONLY — pages delegate to features/
features/     # One folder per domain (components, hooks, api, types, lib, index.ts)
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

## 이슈 & PR 워크플로우

**모든 작업은 이슈 → 브랜치 → PR 순서를 따른다.**

### 이슈 생성

반드시 `.github/ISSUE_TEMPLATE/` 템플릿 중 가장 적절한 것을 선택한다.

| 템플릿                | 사용 시점                                 |
| --------------------- | ----------------------------------------- |
| `feature_request.yml` | 새 기능, 새 페이지, 신규 도구/인프라 추가 |
| `enhancement.yml`     | 기존 기능 개선, 성능 향상                 |
| `refactor.yml`        | 코드 구조 개선, 기술 부채 해소            |
| `hotfix.yml`          | 프로덕션 긴급 버그 수정                   |

```bash
gh issue create --title "[type] 제목" --label "레이블" --body "..."
```

### 브랜치 생성

이슈 번호를 포함한 브랜치명으로 git flow를 사용한다.

```bash
git flow feature start {이슈번호}-{kebab-case-description}
# 예: git flow feature start 240-claude-harness-setup
```

### PR 생성

반드시 `.github/pull_request_template.md`를 사용한다. PR 제목은 Conventional Commit 형식으로 작성한다.

```bash
gh pr create --base develop --title "[type] 제목" --body "$(cat <<'EOF'
# PR 템플릿 내용
EOF
)"
```

## React Query Defaults

Configured in `shared/lib/get-query-client.ts`: staleTime 1 min, gcTime 5 min, no retries, throwOnError enabled, no refetchOnWindowFocus.

---

## Skills & Guidelines

| Topic                       | Source                                      |
| --------------------------- | ------------------------------------------- |
| Folder architecture & rules | `.claude/references/folder-architecture.md` |

---

## 하네스: Feature 구현 팀

**목표:** 새 feature 요청을 planner → implementer → guardian 파이프라인으로 처리해 도메인 규칙을 지키며 검증된 코드를 산출한다.

**트리거:** 새 기능 구현, 컴포넌트/훅/API 추가 요청 시 `feature` 스킬을 사용하라. 단순 질문·버그 수정·리팩토링은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-27 | 초기 구성 | 전체 | harness@harness-marketplace 설치 후 신규 구축 |
| 2026-06-29 | gitflow 스킬 추가 | skills/gitflow | docs/workflow-and-gitflow.md 기반 이슈→브랜치→PR 워크플로우 자동화 |
| 2026-06-29 | frontend-design-principles 스킬 추가 | skills/frontend-design-principles | 응집도·결합도·의존성·추상화·DRY·YAGNI 등 설계 원칙 판단 기준 |
