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

**도메인 목록:** auth, profile, review, reputation, soft-skills, project, mypage, tag, notifications

## 파일 배치 규칙 (features/{domain}/ 내부)

| 유형              | 위치          | 예시                                              |
| ----------------- | ------------- | ------------------------------------------------- |
| React 컴포넌트    | `components/` | `profile-card.tsx`                                |
| TanStack Query 훅 | `hooks/`      | `use-profile.ts`                                  |
| API 함수          | `api/`        | `fetch-profile.ts`, `queries.ts`, `query-keys.ts` |
| 타입              | `types/`      | `profile.types.ts`                                |
| 유틸/헬퍼         | `utils/`      | `format-profile.ts`                               |
| 도메인 진입점     | `index.ts`    | 외부 공개 심볼만 re-export                        |

## API 패턴 참조

기존 패턴 확인 위치:

- `features/profile/api/` — fetch + queries + query-keys 분리 패턴
- `features/project/api/` — mutations.ts 패턴 (useMutation)
- `features/review/api/` — map 함수로 응답 변환 패턴

## 계획서 품질 기준

- 파일별 책임이 단일하고 명확한가
- 타입/인터페이스가 구체적으로 정의되어 있는가
- 구현 순서가 의존성을 위반하지 않는가 (타입 → API → 훅 → 컴포넌트)
- implementer가 파일을 열지 않고도 무엇을 만들지 알 수 있는가
