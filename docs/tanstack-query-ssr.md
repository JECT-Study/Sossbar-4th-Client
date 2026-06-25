# TanStack Query SSR 가이드 (Sossbar)

이 문서는 [Server Rendering & Hydration](https://tanstack.com/query/latest/docs/framework/react/guides/ssr) 및 [Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr) 가이드를 바탕으로, **Sossbar 프로젝트에서 hydration mismatch를 예방하고 SSR 패턴을 일관되게 적용**하기 위한 내부 가이드입니다.

---

## 목차

1. [배경](#배경)
2. [현재 프로젝트 설정](#현재-프로젝트-설정)
3. [hydration mismatch가 나는 이유](#hydration-mismatch가-나는-이유)
4. [TanStack 가이드 핵심 개념](#tanstack-가이드-핵심-개념)
5. [개선 패턴](#개선-패턴)
6. [파일별 적용 가이드](#파일별-적용-가이드)
7. [HydrationBoundary 배치 검토](#hydrationboundary-배치-검토)
8. [권장 아키텍처](#권장-아키텍처)
9. [체크리스트](#체크리스트)

---

## 배경

Next.js App Router + React 19 환경에서 TanStack Query v5를 사용할 때, **prefetch를 해도 hydration error가 발생**할 수 있습니다.

대표 사례:

| 위치                    | 증상                                                    |
| ----------------------- | ------------------------------------------------------- |
| `HomeProfileButton`     | 서버 `href="/profile"`, 클라이언트 `href="/profile/36"` |
| `ProfileSection`        | 서버에 `ProfileOwnerActions` 없음, 클라이언트에 있음    |
| Header Dropdown (Radix) | `id` 속성 server/client 불일치                          |

이 문서는 React Query prefetch/hydration과 **직접 관련된** mismatch를 다룹니다. Radix `useId` 이슈 등 서드파티 hydration 문제는 별도 대응이 필요합니다.

---

## 현재 프로젝트 설정

### QueryClient (`shared/lib/get-query-client.ts`)

- `staleTime`: 1분
- `gcTime`: 5분
- `retry`: 0, `throwOnError`: true (query hook에서 개별 override 가능)
- `dehydrate.shouldDehydrateQuery`: `pending` 쿼리도 포함 (streaming 패턴 지원)

### Provider (`shared/providers/query-provider.tsx`)

- 루트 `layout.tsx`에서 `QueryProvider` → `MainLayout` 순으로 감쌈
- 브라우저: singleton `QueryClient` 재사용
- 서버: 호출마다 **새 `QueryClient` 인스턴스** 생성

### prefetch + HydrationBoundary 사용처 (예시)

| 위치                                                     | prefetch 대상    |
| -------------------------------------------------------- | ---------------- |
| `app/_components/header/header.tsx`                      | `profileKeys.my` |
| `features/profile/components/profile-section-stream.tsx` | 프로필 by id     |
| `features/review/components/user-review-stream.tsx`      | 리뷰 목록        |

### 이미 잘 적용된 패턴

**Header — 서버 확정값 + 클라이언트 query fallback**

```tsx
// header.tsx (Server): prefetch 후 initialProfile prop 전달
const profile = queryClient.getQueryData<Profile>(profileKeys.my) ?? null;

// header-auth-area-client.tsx (Client)
const profile = hasLoggedOut ? null : (queryProfile ?? initialProfile);
```

**ProfileSection — SSR prop 우선**

```tsx
const isMyProfileFromQuery = useIsMyProfile(userId);
const isMyProfile = isMyProfileProp ?? isMyProfileFromQuery;
```

**프로필 상세 데이터 — `useSuspenseQuery`**

- `use-profile-by-id.query.ts`
- `features/review/api/queries.ts` (`useUserReviews`)
- `features/mypage/hooks/use-profile.ts`

---

## hydration mismatch가 나는 이유

### 1. `useQuery`는 SSR HTML에 데이터를 반영하지 않는다

Advanced SSR 가이드:

> `useQuery`를 써도 Promise는 클라이언트에서 올바르게 pickup되지만, Next.js는 suspend하지 않고 **`pending` 상태로 렌더**한다. 즉 **서버 렌더링에서 콘텐츠가 빠진다**.

prefetch + `HydrationBoundary`가 있어도, **`useQuery` 결과로 href·조건부 UI를 만들면** 서버 HTML과 클라이언트 HTML이 달라질 수 있습니다.

### 2. 서버에서 QueryClient가 분리된다

App Router에서 Client Component SSR pass는 **`QueryProvider`가 제공하는 `QueryClient`**를 사용합니다.

```
QueryProvider (layout)     → QueryClient A (비어 있음)
Header (Server Component)  → QueryClient B (myProfile prefetch)
HomeProfileButton (Client) → QueryClient A 사용 → SSR 시 profile undefined
```

Header의 `HydrationBoundary`는 **헤더 subtree만** 감쌉니다. 홈 본문(`HomeProfileButton`)은 그 boundary 밖이므로, 클라이언트 hydrate 후에야 캐시가 채워지고 HTML이 달라집니다.

### 3. prefetch ≠ SSR markup에 반영

| 단계                             | 역할                                   |
| -------------------------------- | -------------------------------------- |
| prefetch (Server Component)      | 서버에서 데이터 fetch → dehydrate      |
| HydrationBoundary                | 클라이언트 `QueryClient`에 state merge |
| `useQuery` (Client SSR pass)     | **pending** → HTML에 데이터 없음       |
| `useSuspenseQuery` + boundary 안 | 서버 HTML에 데이터 포함                |

---

## TanStack 가이드 핵심 개념

### Server Component vs Client Component (용어)

Advanced SSR:

- **Server Component**: 서버에서만 실행 (loader phase)
- **Client Component**: SSR pass + 브라우저 모두에서 실행 가능 (application phase)

Client Component도 **초기 SSR pass**에서 서버에서 한 번 렌더됩니다. 이때 `useQuery`와 `useSuspenseQuery`의 동작 차이가 hydration mismatch로 이어집니다.

### 데이터 소유권 (Data ownership)

같은 데이터를 **Server Component에서 렌더**하고 **Client Component의 `useQuery`로도 렌더**하면, `staleTime` 이후 revalidate 시 서버 HTML과 클라이언트 상태가 어긋날 수 있습니다.

규칙:

- Server Component → **prefetch 전용** (가능하면 `fetchQuery` 결과를 Server HTML에 직접 렌더하지 않기)
- Client Component → React Query는 **재검증·상호작용**용
- SSR HTML에 필요한 값 → **서버 prop** 또는 **`useSuspenseQuery` + HydrationBoundary**

### `React.cache()` (선택)

서버 컴포넌트 간 prefetch용 `QueryClient` 공유:

```tsx
import { cache } from 'react';

const getQueryClient = cache(() => new QueryClient({ ... }));
```

- 요청(request) 단위로 scope → 사용자 간 데이터 leak 방지
- Header, profile page, stream 컴포넌트 간 prefetch 공유에 유용
- **Client Component SSR mismatch**를 단독으로 해결하지는 못함

---

## 개선 패턴

SSR HTML에 영향을 주는지 여부에 따라 패턴을 선택합니다.

### 패턴 A — query 없이 고정값 (가장 단순)

SSR markup에 query 데이터가 필요 없을 때.

```tsx
// ❌ profile?.userId로 href 생성
<ProtectedLink href={ROUTES.PROFILE(profile?.userId ?? '')}>

// ✅ 고정 경로 (헤더 nav도 /profile 사용)
<ProtectedLink href="/profile">내 프로필 보기</ProtectedLink>
```

로그인 가드는 `ProtectedLink` click handler가 처리하므로 href에 userId가 필수는 아닙니다.

### 패턴 B — 서버 prop (Header와 동일)

서버에서 이미 아는 값을 prop으로 내려 SSR HTML을 확정합니다.

```tsx
// page.tsx (Server Component)
const queryClient = getQueryClient();
await queryClient.prefetchQuery({ queryKey: profileKeys.my, queryFn: ... });
const profile = queryClient.getQueryData<Profile>(profileKeys.my);

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <HomeHeroSection profileHref={profile ? ROUTES.PROFILE(profile.userId) : '/profile'} />
  </HydrationBoundary>
);
```

### 패턴 C — `useSuspenseQuery` + HydrationBoundary

SSR HTML에 query 데이터가 **반드시** 포함되어야 할 때.

1. Server Component에서 `prefetchQuery` (v5.40+ streaming: `await` 없이도 가능)
2. **`해당 UI를 감싸는`** `HydrationBoundary` 배치
3. 자식 Client Component에서 `useSuspenseQuery` 사용

```tsx
// ❌ useQuery만 변경 (boundary/prefetch 없음 → suspend 또는 mismatch)
export const useMyProfile = () => useSuspenseQuery({ ... });

// ✅ prefetch + boundary + suspense query 세트
```

프로젝트의 `use-profile-by-id`, `useUserReviews` 등이 이 패턴입니다.

### 패턴 D — SSR prop + query fallback (조건부 UI)

ownership 판별, 버튼 노출 등 **서버에서 확정 가능한 boolean/값**:

```tsx
interface Props {
  userId: number;
  isMyProfile?: boolean; // Server에서 계산해 전달
}

const isMyProfile = isMyProfileProp ?? isMyProfileFromQuery;
```

`/profile/page.tsx`, `/profile/[userId]/page.tsx`의 `ProfileSectionStream`에 적용된 방식입니다.

---

## 파일별 적용 가이드

| 파일 / 영역                                          | 현재                          | 권장                                                           |
| ---------------------------------------------------- | ----------------------------- | -------------------------------------------------------------- |
| `app/(home)/home-profile-button.tsx`                 | `useMyProfile` → dynamic href | **패턴 A** (`href="/profile"`) 또는 홈 page **패턴 B**         |
| `app/_components/header/header-auth-area-client.tsx` | `initialProfile` fallback     | ✅ 유지                                                        |
| `features/profile/components/profile-section.tsx`    | `isMyProfile` prop            | ✅ 유지                                                        |
| `features/review/.../user-review-container.tsx`      | `useIsMyProfile` only         | profile page에서 `isMyProfile` prop 전달 (**패턴 D**)          |
| `features/profile/hooks/use-my-profile.query.ts`     | 전역 `useQuery`               | SSR-visible UI용 hook 분리 검토 (`useSuspenseQuery` 또는 prop) |
| `shared/components/protected-link/`                  | click 시 `useMyProfile`       | ✅ SSR HTML에 영향 없음 — `useQuery` 유지 가능                 |
| `project-card.tsx` 등                                | 조건부 UI                     | SSR에 보이면 prop/suspense, 숨김이면 OK                        |

### `useQuery` vs `useSuspenseQuery` 선택 기준

| 조건                                            | 선택                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| SSR HTML / attribute(href, class)에 데이터 반영 | `useSuspenseQuery` + prefetch + boundary, 또는 **서버 prop** |
| 클릭 핸들러, 모달, 로그아웃 등 클라이언트 전용  | `useQuery`                                                   |
| 서버에서 이미 fetch한 전역 데이터 (myProfile)   | **prop fallback** (`initialProfile` 패턴)                    |

---

## HydrationBoundary 배치 검토

### Pages Router vs App Router

|                 | Pages Router (구 SSR 가이드)                | App Router (Advanced SSR)                     |
| --------------- | ------------------------------------------- | --------------------------------------------- |
| boundary 위치   | `_app.tsx`에서 Provider **바로 아래** 한 번 | **route / feature 단위**로 여러 번            |
| dehydratedState | `getServerSideProps` → `pageProps`          | Server Component에서 `dehydrate(queryClient)` |
| layout에서 제거 | `_app`에 모아 boilerplate 제거 가능         | **불가** — "every route"에 boundary 필요      |

App Router에서는 TanStack이 명시적으로:

> SSR 가이드의 `<HydrationBoundary>` boilerplate 제거 패턴은 **Server Components에서는 불가능**하다.

### Provider **파일 안에** HydrationBoundary를 넣는 것 — 비권장

```tsx
// ❌ QueryProvider 내부에 boundary 고정
const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={???}>  {/* dehydratedState를 어디서? */}
      {children}
    </HydrationBoundary>
  </QueryClientProvider>
);
```

- `QueryProvider`는 `'use client'` → prefetch/dehydrate는 **Server Component**에서 수행해야 함
- `dehydratedState`는 layout/page마다 다름 → Provider 파일에 하드코딩 불가
- 페이지별 prefetch를 root Provider에 몰아넣으면 **불필요한 fetch·waterfall** 발생

Pages Router의 `_app` 패턴은 **`pageProps.dehydratedState`를 props로 받을 수 있어서** Provider 아래에 둘 수 있었습니다. App Router에는 동등한 단일 진입점이 없습니다.

### Provider **트리상 직후(자식)** 전역 boundary — 조건부 권장

```tsx
// app/layout.tsx
<QueryProvider>
  <MainLayout>{children}</MainLayout> {/* Server Component */}
</QueryProvider>;

// app/_components/main-layout.tsx (Server Component)
export const MainLayout = async ({ children }) => {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfile({ headers: { Cookie: cookieStore.toString() } }),
  });
  const profile = queryClient.getQueryData<Profile>(profileKeys.my) ?? null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainLayoutClient header={<HeaderAuthArea initialProfile={profile} />}>{children}</MainLayoutClient>
    </HydrationBoundary>
  );
};
```

**장점**

- `myProfile`처럼 **앱 전역**에서 쓰는 쿼리가 Header·Home·ProtectedLink 등 **모든 subtree**에 hydrate됨
- Header 내부 boundary + prefetch **중복 제거** 가능
- `HomeProfileButton` mismatch 근본 원인(형제 subtree) 해소

**단점 / 주의**

- layout에서 prefetch하는 데이터는 **모든 페이지**에 적용됨 → truly global한 쿼리만
- 페이지 전용 prefetch(profile by id, reviews 등)는 **여전히 page/stream boundary** 필요
- `React.cache(getQueryClient)` 미사용 시 layout·Header·Stream 각각 별도 client → dehydrate 범위만 boundary subtree에 해당

### 여러 HydrationBoundary 중첩 — 권장 (TanStack 공식)

Advanced SSR:

> `<HydrationBoundary>`를 여러 곳에서 사용하고, prefetch마다 별도 `queryClient`를 써도 **문제없다**.

Sossbar 권장 레이어:

```
QueryProvider                          ← layout (client singleton)
└── HydrationBoundary                  ← MainLayout (global: myProfile)
    ├── Header / Home / Footer / ...
    └── {children}
        └── HydrationBoundary          ← profile page / *Stream (page-specific)
            └── Client components (useSuspenseQuery)
```

### 배치 결론

| 방식                                                  | 판단                                                  |
| ----------------------------------------------------- | ----------------------------------------------------- |
| `QueryProvider` **내부**에 boundary                   | ❌ 비권장 — dehydratedState 전달 구조상 맞지 않음     |
| `QueryProvider` **직후** MainLayout에서 전역 boundary | ✅ **myProfile 등 전역 쿼리**에 권장                  |
| Header **내부** boundary만                            | ⚠️ 헤더 subtree만 hydrate — **홈·본문 mismatch 위험** |
| page / `*Stream` boundary                             | ✅ 페이지·feature prefetch — **유지**                 |

---

## 권장 아키텍처 (적용됨)

```text
[Server] layout.tsx
  QueryProvider (client)
    MainLayout (server)
      prefetch myProfile (Cookie 헤더)
      HydrationBoundary ─────────────────── global
        MainLayoutClient
          HeaderAuthArea (Suspense → useMyProfile)
          main
            page (server)
              prefetch page data
              HydrationBoundary ─────────── page/feature
                *Stream / Client UI
                  useSuspenseQuery
```

### 적용 파일

| 파일                                                | 역할                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| `features/profile/api/fetch-my-profile-optional.ts` | 401 → `null`, 그 외 에러 throw                    |
| `features/profile/hooks/use-my-profile.query.ts`    | `useSuspenseQuery`                                |
| `app/_components/main-layout.tsx`                   | `cookies()` + prefetch + 전역 `HydrationBoundary` |
| `app/_components/header/header.tsx`                 | prefetch 제거 (MainLayout 위임)                   |

### 남은 작업

- `UserReviewContainer` 등에 `isMyProfile` prop (패턴 D)
- 선택: `getQueryClient`에 `React.cache()` — 서버 prefetch client 공유

---

## 쿠키 기반 인증 + Suspense SSR 동작

Sossbar는 JWT를 **HttpOnly 쿠키**(`accessToken` 등)로 관리한다. 서버와 브라우저는 쿠키를 읽는 방식이 다르므로, myProfile SSR은 **두 경로**로 나뉜다.

### 서버 (RSC / SSR pass)

```text
브라우저 요청
  Cookie: accessToken=...
    ↓
MainLayout (Server Component)
  cookies().toString() → prefetchQuery → fetchMyProfileOptional({ headers: { Cookie: ... } })
    ↓
백엔드 API (NEXT_PUBLIC_API_BASE_URL/api/v1/users/profile)
  - 브라우저 프록시(/api/v1)를 거치지 않고 절대 URL로 직접 호출
  - Request Cookie 헤더로 세션 전달
    ↓
성공 → Profile | 401 → null (fetchMyProfileOptional)
    ↓
queryClient.prefetchQuery → dehydrate → HydrationBoundary
```

서버에서는 `document.cookie`를 쓸 수 없다. **`next/headers`의 `cookies()`** 로 요청 쿠키를 읽고, `fetch`의 `Cookie` 헤더에 **명시적으로** 실어 보내야 한다.

### 클라이언트 (hydrate 이후)

```text
useSuspenseQuery({ queryFn: () => fetchMyProfileOptional() })
  ↓
apiRequest → fetch('/api/v1/users/profile', { credentials: 'same-origin' })
  - 브라우저가 HttpOnly 쿠키를 자동 첨부
  - Cookie 헤더를 JS에서 설정할 필요 없음
```

hydrate 직후에는 **서버가 prefetch한 `Profile | null`이 캐시에 있으므로** `staleTime`(1분) 동안 refetch 없이 SSR HTML과 동일한 값을 쓴다.

### 로그인 / 비로그인별 SSR HTML

| 상태     | prefetch 결과 | SSR `HomeProfileButton` href | Header             |
| -------- | ------------- | ---------------------------- | ------------------ |
| 비로그인 | `null`        | `/profile`                   | 카카오 로그인 버튼 |
| 로그인   | `Profile`     | `/profile/{userId}`          | 아바타 + 드롭다운  |

서버·클라이언트 모두 `useSuspenseQuery` + 동일 캐시 → **href mismatch 없음**.

### 401·403을 `null`로 처리하는 이유

`useSuspenseQuery`는 queryFn이 **throw하면 Error Boundary**로 넘긴다.  
Sossbar API는 미로그인 시 **401 또는 403**을 반환하므로, 둘 다 정상 guest 흐름으로 `null`을 캐시한다.

보호 라우트(`/profile`, `/mypage` 등)는 별도 **middleware / layout redirect**로 막고, 공개 페이지(홈)에서는 `null` = guest UI로 처리한다.

`MainLayout`에서 `await cookies()`를 호출하므로 **요청마다 동적 렌더(ƒ)** 가 된다. 쿠키·세션 기반 prefetch와 SSR HTML 일치를 위해 의도된 설정이다.

### Suspense boundary가 필요한 이유

prefetch가 끝난 **초기 페이지 로드**에서는 suspend하지 않는다. 다만:

- 클라이언트 네비게이션 후 캐시 miss
- 로그아웃 후 `queryClient.clear()`

같은 경우 `useSuspenseQuery`가 suspend할 수 있다. `HeaderAuthArea`, `HomeProfileButton` 등에 `<Suspense fallback={...}>`를 두어 상위 트리 전체가 멈추지 않게 한다.

---

## 체크리스트

새 Client Component에서 React Query 데이터를 쓸 때:

- [ ] 이 값이 **SSR HTML**(텍스트, href, `className`, 조건부 자식)에 들어가는가?
- [ ] 들어간다 → `useSuspenseQuery` + ancestor `HydrationBoundary` + prefetch, **또는** Server prop
- [ ] 들어가지 않는다 (click handler only) → `useQuery` OK
- [ ] 서버 Server Component에서 이미 fetch했는가? → MainLayout 전역 boundary + `useSuspenseQuery`
- [ ] prefetch boundary가 **해당 컴ponent의 ancestor**인가? (형제 subtree면 hydrate 안 됨)
- [ ] 같은 데이터를 Server HTML과 Client query **양쪽에서 독립 렌더**하지 않는가?

---

## 참고

- [TanStack Query — Server Rendering & Hydration](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [TanStack Query — Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- 프로젝트 설정: `shared/lib/get-query-client.ts`, `shared/providers/query-provider.tsx`
- React 성능: `.agents/skills/vercel-react-best-practices/AGENTS.md`
