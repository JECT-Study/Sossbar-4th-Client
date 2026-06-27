# TanStack Query SSR (Server Rendering & Hydration)

출처: https://tanstack.com/query/latest/docs/framework/react/guides/ssr

## 핵심 개념

SSR에서 React Query가 하는 일:

1. **Prefetch** — 서버에서 데이터 미리 가져오기
2. **Dehydrate** — 직렬화 가능한 형태로 마크업에 포함
3. **Hydrate** — 클라이언트에서 캐시 복원 (불필요한 재요청 방지)

## initialData 방식 (간단하지만 한계 있음)

```tsx
export async function getServerSideProps() {
  const posts = await getPosts();
  return { props: { posts } };
}

function Posts(props) {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: props.posts,
  });
}
```

**한계:**

- 깊은 컴포넌트 트리에서 props drilling 필요
- 같은 쿼리를 여러 곳에서 쓸 때 취약
- `dataUpdatedAt`을 페이지 로드 시점 기준으로 계산
- 이미 캐시에 있는 데이터를 덮어쓰지 않음 (getServerSideProps 재방문 시 문제)

## Hydration API 방식 (권장)

### App Router 패턴 (Next.js 16 기준)

```tsx
// app/providers.tsx
'use client';
import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // SSR에서는 0보다 큰 값 권장 (클라이언트 즉시 재요청 방지)
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient(); // 서버: 매 요청마다 새 클라이언트 (데이터 공유 방지)
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient; // 브라우저: 싱글톤 (React Suspense 재렌더 대응)
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

```tsx
// app/layout.tsx
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// app/posts/page.tsx (Server Component)
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
// app/posts/posts.tsx (Client Component)
'use client';

export default function Posts() {
  // 프리페치된 쿼리 → 즉시 데이터 사용 가능 (추가 요청 없음)
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  // 프리페치 안 된 쿼리 → 클라이언트에서 요청 (두 패턴 혼합 OK)
  const { data: commentsData } = useQuery({ queryKey: ['posts-comments'], queryFn: getComments });
}
```

## 주의사항

- `queryClient`를 **파일 최상위**에 만들면 모든 요청이 캐시를 공유 → 보안 위험 + 성능 저하
- 병렬 prefetch는 `await Promise.all([...])` 사용
- 프리페치 안 해도 괜찮음 — 클라이언트에서 로드됨 (두 패턴 혼합 가능)
- Server Action을 `queryFn`으로 사용 금지 (직렬 실행으로 pending 상태 stuck 가능)
