---
name: folder-architecture
description: 파일 위치 결정, 새 기능 추가, 도메인 간 참조 방식을 검토할 때 사용. 새 페이지/컴포넌트/훅/API를 추가하기 전에 반드시 확인한다.
---

# Folder Architecture

## 전체 구조

```
app/           # 라우팅 레이어 — 비즈니스 로직 없음
features/      # 도메인별 모든 기능
shared/        # 2개 이상 도메인이 실제로 쓰는 코드만
styles/        # 디자인 시스템 CSS
```

---

## app/ — 라우팅만

`app/`은 라우트 정의와 feature 컴포넌트 조합만 한다. 비즈니스 로직, 데이터 페칭, 상태관리는 전부 `features/`로.

```tsx
// ❌ app/에 로직
export default async function ProfilePage({ params }) {
  const profile = await fetchProfile(params.userId); // 여기 있으면 안 됨
  return <div>{profile.name}</div>;
}

// ✅ app/은 조합만
import { ProfileSection } from '@/features/profile';
export default function ProfilePage({ params }) {
  return <ProfileSection userId={params.userId} />;
}
```

**`app/` 안에 컴포넌트 파일을 만들지 않는다.** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` 외의 파일은 `features/`로.

---

## features/ — 도메인 구조

### 표준 구조

```
features/[domain]/
  index.ts                    # 외부 공개 심볼만 re-export (필수)
  api/
    [domain].fetchers.ts      # raw fetch 함수
    [domain].query-keys.ts    # query key factory
    [domain].queries.ts       # queryOptions / prefetch helpers
    [domain].mutations.ts     # mutation API 함수 (필요 시)
  components/
    [component].tsx
  hooks/
    use-[name].query.ts       # TanStack Query 훅
    use-[name].mutation.ts    # TanStack Mutation 훅
    use-[name].ts             # 기타 UI 훅
  types/
    [domain].types.ts         # TypeScript 타입 + Zod infer 타입
    [domain].schemas.ts       # Zod 스키마
    [domain].constants.ts     # 도메인 상수
  lib/                        # 도메인 전용 순수 유틸 함수
    [util-name].ts
```

### 실제 예시 (profile 도메인)

```
features/profile/
  index.ts
  profile.query-keys.ts        # ← 루트에 있는 건 api/로 이동 대상
  api/
    fetch-profile-by-id.ts
    fetch-my-profile.ts
    update-profile.ts
  components/
    profile-section.tsx
    profile-avatar.tsx
  hooks/
    use-profile-by-id.query.ts
    use-my-profile.query.ts
    use-update-profile.mutation.ts
  types/
    profile.types.ts
    profile.schemas.ts
  lib/
    build-profile-share-url.ts
```

### 파일 위치 결정표

| 파일 유형                    | 위치                           |
| ---------------------------- | ------------------------------ |
| raw fetch 함수               | `api/[domain].fetchers.ts`     |
| Query Key Factory            | `api/[domain].query-keys.ts`   |
| queryOptions / prefetch      | `api/[domain].queries.ts`      |
| useMutation API              | `api/[domain].mutations.ts`    |
| useQuery/useSuspenseQuery 훅 | `hooks/use-[name].query.ts`    |
| useMutation 훅               | `hooks/use-[name].mutation.ts` |
| UI 상태 훅                   | `hooks/use-[name].ts`          |
| React 컴포넌트               | `components/[name].tsx`        |
| TypeScript 타입, Zod infer   | `types/[domain].types.ts`      |
| Zod 스키마                   | `types/[domain].schemas.ts`    |
| 상수                         | `types/[domain].constants.ts`  |
| 순수 유틸 함수               | `lib/[util-name].ts`           |

---

## 도메인 간 참조 규칙

### 의존 방향 (단방향)

```
Layer 0   auth
  ↓
Layer 1   profile, project
  ↓
Layer 2   review, tag, soft-skills, mypage, notifications, reputation
```

- **하위 레이어 → 상위 레이어 참조 금지** (auth가 review를 import하면 안 됨)
- **같은 레이어끼리 cross-import 금지** (review가 tag를 import하면 안 됨)
- cross-import가 필요해 보이면 **shared/로 올리거나 설계를 재검토**한다

### 참조 방법

다른 도메인을 참조할 때는 반드시 `index.ts`를 통해서만.

```ts
// ❌ 도메인 내부 직접 참조
import { useProfile } from '@/features/profile/hooks/use-profile-by-id.query';

// ✅ index.ts 경유
import { useProfile } from '@/features/profile';
```

### index.ts 작성 원칙

외부에서 실제로 필요한 것만 export한다. `export *` 금지.

```ts
// features/profile/index.ts

// ✅ 필요한 것만
export { ProfileSection } from './components/profile-section';
export { useProfile } from './hooks/use-profile-by-id.query';
export type { Profile } from './types/profile.types';

// ❌ 전체 barrel export
export * from './components/profile-section';
```

---

## shared/ — 실제 2회 이상 재사용되는 코드만

```
shared/
  components/   # 도메인 지식 없는 범용 UI
  hooks/        # 범용 훅
  lib/          # 범용 유틸, API client
  providers/    # Context providers
  constants/    # 전역 상수, 라우트
  assets/       # 아이콘 등
```

**shared/ 승격 기준:** 두 번째 실제 사용이 생겼을 때. 미래를 예측해서 미리 올리지 않는다.

```ts
// ❌ shared/components에 도메인 지식
export const ProfileCard = ({ profile }: { profile: Profile }) => { ... };

// ✅ shared/components는 범용
export const Card = ({ title, children }: CardProps) => { ... };
// 도메인 카드는 features/profile/components/profile-card.tsx
```

---

## 네이밍 컨벤션

| 대상           | 규칙                           | 예시                             |
| -------------- | ------------------------------ | -------------------------------- |
| 도메인 폴더    | kebab-case                     | `soft-skills/`                   |
| 컴포넌트 파일  | kebab-case                     | `profile-card.tsx`               |
| Query 훅       | `use-` + noun + `.query.ts`    | `use-profile.query.ts`           |
| Mutation 훅    | `use-` + verb + `.mutation.ts` | `use-update-profile.mutation.ts` |
| Fetcher 파일   | `fetch-` + resource            | `fetch-profile-by-id.ts`         |
| Query Key 파일 | `[domain].query-keys.ts`       | `profile.query-keys.ts`          |
| 타입 파일      | `[domain].types.ts`            | `profile.types.ts`               |
| 스키마 파일    | `[domain].schemas.ts`          | `profile.schemas.ts`             |
| 유틸 파일      | 동사-명사                      | `build-share-url.ts`             |

---

## 안티패턴

| 안티패턴                            | 문제                           | 해결                                   |
| ----------------------------------- | ------------------------------ | -------------------------------------- |
| `app/`에 컴포넌트 파일              | 라우팅과 UI 로직이 섞임        | `features/[domain]/components/`로 이동 |
| 도메인 내부 직접 import             | 리팩토링 시 깨짐               | `index.ts` 경유                        |
| 역방향 레이어 참조                  | 순환 의존성 위험               | 의존 방향 재검토, shared/ 승격         |
| 예방적 shared/ 승격                 | 불필요한 추상화                | 2번째 실사용 시점에 올림               |
| `export *` barrel                   | 불필요한 노출, 트리쉐이킹 방해 | 필요한 것만 명시 export                |
| query-keys를 도메인 루트에 flat하게 | 위치 불일치                    | `api/[domain].query-keys.ts`로 통일    |
