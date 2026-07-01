---
name: folder-architecture
description: 'MUST READ before any file creation or feature work. 파일 위치·네이밍·도메인 레이어·import 방향 모든 규칙이 여기에 있다. 새 페이지·컴포넌트·훅·API를 추가하거나 도메인 간 참조를 결정할 때 이 파일을 읽지 않으면 규칙 위반이 발생한다.'
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

### app/ 라우트 → feature 매핑

| 라우트                 | 사용하는 feature                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `(public)/login`       | `features/auth`                                                                                   |
| `(public)/signup`      | `features/auth`                                                                                   |
| `(protected)/profile`  | `features/profile`                                                                                |
| `(protected)/personal` | `features/profile`, `features/tag`, `features/soft-skills`, `features/review`, `features/project` |
| `(protected)/projects` | `features/project`                                                                                |
| `(protected)/reviews`  | `features/review`                                                                                 |

`(protected)/personal` (내 소스)은 여러 feature를 조합하는 페이지다. feature 간 조합 로직은 page.tsx에서 처리하며, 별도 `my-page` feature를 만들지 않는다.

---

## features/ — 도메인 구조

### 표준 구조

```
features/[domain]/
  index.ts                    # 외부 공개 심볼만 re-export (필수)
  [domain].api.ts             # fetcher + query-key + queryOptions 통합
  [domain].hooks.ts           # useQuery / useMutation 훅
  [domain].types.ts           # TypeScript 타입 + Zod infer 타입
  [domain].schemas.ts         # Zod 스키마
  [domain].constants.ts       # 도메인 상수 (필요 시)
  [domain].lib.ts             # 도메인 전용 순수 유틸 (필요 시)
  components/
    [component].tsx
```

### 실제 예시 (project 도메인)

```
features/project/
  index.ts
  project.api.ts              # GET /projects, GET /projects/:id, POST /projects — 다 여기
  project.hooks.ts            # useProjects, useProject, useCreateProject — 다 여기
  project.types.ts
  project.schemas.ts
  components/
    project-card.tsx
    create-project-form.tsx
```

도메인이 이미 경계다. 도메인 내에서 create/update 등으로 파일을 미리 나누지 않는다. 파일이 실제로 커졌을 때 나눈다.

### 파일 위치 결정표

| 파일 유형                                         | 위치                    |
| ------------------------------------------------- | ----------------------- |
| fetcher + query-key + queryOptions + mutation API | `[domain].api.ts`       |
| useQuery / useSuspenseQuery / useMutation 훅      | `[domain].hooks.ts`     |
| UI 상태 훅                                        | `[domain].hooks.ts`     |
| React 컴포넌트                                    | `components/[name].tsx` |
| TypeScript 타입, Zod infer                        | `[domain].types.ts`     |
| Zod 스키마                                        | `[domain].schemas.ts`   |
| 상수                                              | `[domain].constants.ts` |
| 순수 유틸 함수                                    | `[domain].lib.ts`       |

---

## 도메인 간 참조 규칙

### 의존 방향 (단방향)

```
Layer 0   auth                                          # 가장 기반 — 세션·유저 개념 제공
  ↓
Layer 1   profile, project                              # auth에 의존 가능
  ↓
Layer 2   review, spectrum, tag, notifications          # Layer 1 이하에 의존 가능
```

- `mypage`는 별도 feature로 두지 않는다. `app/(protected)/personal/page.tsx`에서 각 feature를 조합한다.
- `reputation`은 사용하지 않는다.
- `spectrum` 폴더명은 현재 `soft-skills/`로 존재한다 (추후 rename 예정).

#### 레이어 방향 결정 기준

"A 없이 B가 존재할 수 있는가?"로 판단한다.

```
auth 없이 profile이 존재할 수 있나? → NO  → profile이 auth에 의존
profile 없이 auth가 존재할 수 있나? → YES → auth는 profile을 몰라도 됨
```

더 독립적인 쪽이 상위 레이어(낮은 번호)다.

- **하위 레이어 → 상위 레이어 참조 금지** (auth가 review를 import하면 안 됨)
- **같은 레이어끼리 cross-import 금지** (review가 tag를 import하면 안 됨)
- cross-import가 필요해 보이면 **shared/로 올리거나 설계를 재검토**한다

#### cross-feature import 방법

하위 레이어가 상위 레이어를 참조할 때는 `index.ts`를 통해서만.

```ts
// features/profile에서 auth의 현재 유저 정보를 쓸 때
import { useMe } from '@/features/auth'; // ✅ auth → profile 방향, index.ts 경유

// auth가 profile을 참조하려 할 때
import { useProfile } from '@/features/profile'; // ❌ 역방향 금지
```

### 참조 방법

다른 도메인을 참조할 때는 반드시 `index.ts`를 통해서만.

```ts
// ❌ 도메인 내부 직접 참조
import { useProfile } from '@/features/profile/hooks/use-profile-by-id.query';

// ✅ index.ts 경유
import { useProfile } from '@/features/profile';
```

### auth 도메인 범위

`auth`는 인증 플로우 + 현재 유저 조회 + 헤더 컴포넌트를 소유한다.

```
features/auth/
  components/
    login-form.tsx
    signup-form.tsx
    header.tsx          # 모든 페이지 공통 헤더 (인증 상태에 따라 달라짐)
    header-profile.tsx  # 헤더 내 미니 프로필 UI (compact)
  hooks/
    use-me.query.ts     # 현재 로그인 유저 조회 — 다른 feature가 import해서 씀
    use-login.mutation.ts
    use-signup.mutation.ts
  api/
    auth.fetchers.ts
    auth.query-keys.ts
```

헤더 내 미니 프로필(HeaderProfile)과 내 소스 페이지의 풀 프로필(ProfileSection)은 UI가 다르다.
`HeaderProfile`은 auth가 소유하고, `ProfileSection`은 `features/profile`이 소유한다. 둘 다 `useMe`를 `features/auth`에서 가져온다.

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

| 대상          | 규칙                    | 예시                   |
| ------------- | ----------------------- | ---------------------- |
| 도메인 폴더   | kebab-case              | `soft-skills/`         |
| API 파일      | `[domain].api.ts`       | `profile.api.ts`       |
| 훅 파일       | `[domain].hooks.ts`     | `profile.hooks.ts`     |
| 타입 파일     | `[domain].types.ts`     | `profile.types.ts`     |
| 스키마 파일   | `[domain].schemas.ts`   | `profile.schemas.ts`   |
| 상수 파일     | `[domain].constants.ts` | `project.constants.ts` |
| 유틸 파일     | `[domain].lib.ts`       | `profile.lib.ts`       |
| 컴포넌트 파일 | kebab-case              | `profile-card.tsx`     |

---

## 안티패턴

| 안티패턴                                   | 문제                               | 해결                                   |
| ------------------------------------------ | ---------------------------------- | -------------------------------------- |
| `app/`에 컴포넌트 파일                     | 라우팅과 UI 로직이 섞임            | `features/[domain]/components/`로 이동 |
| 도메인 내부 직접 import                    | 리팩토링 시 깨짐                   | `index.ts` 경유                        |
| 역방향 레이어 참조                         | 순환 의존성 위험                   | 의존 방향 재검토, shared/ 승격         |
| 예방적 shared/ 승격                        | 불필요한 추상화                    | 2번째 실사용 시점에 올림               |
| `export *` barrel                          | 불필요한 노출, 트리쉐이킹 방해     | 필요한 것만 명시 export                |
| 도메인 내 create/update를 파일로 미리 분리 | YAGNI, 실제 크기 전에 복잡도 추가  | 파일이 실제로 커졌을 때 나눔           |
| `my-page` feature 생성                     | 단순 조합 페이지에 불필요한 도메인 | `app/personal/page.tsx`에서 직접 조합  |
