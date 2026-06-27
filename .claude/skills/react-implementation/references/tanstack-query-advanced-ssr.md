# TanStack Query Advanced SSR (Server Components + Streaming)

출처: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

## Server Components에서의 프리페치

Server Component = "프리페치만 하는 곳"으로 취급한다. `fetchQuery`로 데이터를 직접 렌더링하지 말 것 (revalidation 시 Server Component와 Client Component가 out-of-sync).

### 기본 패턴

```tsx
// app/posts/page.tsx (Server Component — async 함수)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Posts from './posts';

export default async function PostsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

```tsx
// app/posts/posts.tsx ('use client')
'use client';

export default function Posts() {
  const { data } = useQuery({ queryKey: ['posts'], queryFn: () => getPosts() });
  // ...
}
```

### 중첩 Server Component 프리페치

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
      <CommentsServerComponent /> {/* 각각 자체 prefetch */}
    </HydrationBoundary>
  );
}

// app/posts/comments-server.tsx
export default async function CommentsServerComponent() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['posts-comments'], queryFn: getComments });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments />
    </HydrationBoundary>
  );
}
```

> 위 패턴은 서버에서 waterfall이 발생함 (getPosts → getComments 순차). parallel routes로 해결 가능.

### 단일 queryClient 공유 (선택적 대안)

```tsx
// app/get-query-client.ts
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// cache()는 요청 단위로 격리됨 (요청 간 데이터 누수 없음)
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
```

Server Component 어디서나 `getQueryClient()`로 접근 가능. 단, `dehydrate(getQueryClient())`는 매번 전체 캐시를 직렬화하므로 오버헤드 있음.

## Streaming with Server Components (v5.40.0+)

`await` 없이도 pending 쿼리를 dehydrate해서 스트리밍 가능.

### get-query-client.ts 설정

```tsx
// app/get-query-client.ts
import { environmentManager, QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
      dehydrate: {
        // pending 쿼리도 dehydrate에 포함
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        shouldRedactErrors: () => false, // Next.js가 직접 처리
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
```

### await 없는 prefetch + useSuspenseQuery

```tsx
// app/posts/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from './get-query-client';
import Posts from './posts';

export default function PostsPage() {
  const queryClient = getQueryClient();

  // await 없음 → 렌더링 블로킹 안 함 + 데이터는 스트리밍으로 전달
  queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

```tsx
// app/posts/posts.tsx
'use client';

export default function Posts() {
  // useSuspenseQuery: Promise를 클라이언트에서 "use"
  const { data } = useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts });
  // ...
}
```

> `useQuery`도 동작하지만 pending 상태로 렌더링됨 → 서버 렌더링 비활성화됨.

## 데이터 소유권 규칙

Server Component와 Client Component가 **같은 쿼리 데이터를 동시에 렌더링하지 말 것**.

```tsx
// ❌ 잘못된 패턴
export default async function PostsPage() {
  const queryClient = new QueryClient();
  const posts = await queryClient.fetchQuery({ queryKey: ['posts'], queryFn: getPosts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>Nr of posts: {posts.length}</div> {/* 서버에서 렌더 */}
      <Posts /> {/* 클라이언트에서 revalidation 시 out-of-sync */}
    </HydrationBoundary>
  );
}
```

**규칙:** Server Component에서는 `prefetchQuery`만, `fetchQuery`는 피하라. 결과를 Server Component에서 직접 렌더링하지 말 것.

## React Query + Server Components 사용 적합한 경우

- 기존 React Query 앱을 Server Components로 마이그레이션하는 경우
- 친숙한 패러다임 유지하면서 Server Components 일부 도입하는 경우
- React Query가 커버하는 기능(optimistic updates, polling 등)이 필요한 경우

**새 프로젝트라면:** 프레임워크 기본 데이터 페칭으로 시작하고, 필요할 때만 React Query 도입을 고려.
