---
name: domain-planning
description: Sossbar 도메인 배치 및 파일 구조 계획 스킬. planner 에이전트가 feature 요청을 받아 어디에 무엇을 만들지 결정할 때 사용.
---

# 도메인 배치 & 계획 수립

## 코드베이스 탐색 순서

1. `.claude/references/folder-architecture.md` 읽기 (배치 규칙 파악)
2. `features/{관련 도메인}/` 탐색 (기존 패턴 파악)
3. `shared/` 탐색 (재사용 가능한 컴포넌트/훅 파악)
4. 유사한 기존 feature의 파일 구조 참조

## 도메인 배치 결정 트리

```
새 코드가...
├── 특정 도메인에만 쓰임? → features/{domain}/
├── 2개 이상 도메인에서 실제로 쓰임? → shared/
└── 라우팅/페이지? → app/{route}/page.tsx (로직은 features/로)
```

**도메인 목록 (Layer 0 → 2):**

| Layer | 도메인 | 비고 |
|-------|--------|------|
| 0 | `auth` | 인증, 세션, 헤더, useMe |
| 1 | `profile`, `project` | auth에 의존 가능 |
| 2 | `review`, `spectrum`, `tag`, `notifications` | Layer 1 이하에 의존 가능 |

- `reputation` — 사용하지 않음
- `mypage` — 별도 feature 없음, `app/(protected)/personal/page.tsx`에서 각 feature 조합
- `spectrum` — 코드 폴더명은 `soft-skills/` (추후 rename 예정)

## 파일 배치 규칙 (features/{domain}/ 내부)

flat 파일 구조를 사용한다. `api/`, `hooks/`, `types/` 폴더를 만들지 않는다.

| 유형                               | 위치                    | 예시                       |
| ---------------------------------- | ----------------------- | -------------------------- |
| React 컴포넌트                     | `components/`           | `profile-card.tsx`         |
| fetcher + queryOptions + mutationFn | `[domain].api.ts`      | `profile.api.ts`           |
| useQuery / useMutation 훅          | `[domain].hooks.ts`     | `profile.hooks.ts`         |
| TypeScript 타입 + Zod infer        | `[domain].types.ts`     | `profile.types.ts`         |
| Zod 스키마                         | `[domain].schemas.ts`   | `profile.schemas.ts`       |
| 상수                               | `[domain].constants.ts` | `project.constants.ts`     |
| 순수 유틸                          | `[domain].lib.ts`       | `profile.lib.ts`           |
| 도메인 진입점                      | `index.ts`              | 외부 공개 심볼만 re-export |

## 계획서 품질 기준

- 파일별 책임이 단일하고 명확한가
- 타입/인터페이스가 구체적으로 정의되어 있는가
- 구현 순서가 의존성을 위반하지 않는가 (타입 → API → 훅 → 컴포넌트)
- implementer가 파일을 열지 않고도 무엇을 만들지 알 수 있는가
