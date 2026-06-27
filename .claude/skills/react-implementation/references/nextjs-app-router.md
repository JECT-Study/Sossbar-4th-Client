# Next.js App Router 핵심 패턴

출처: https://nextjs.org/docs/app (v16.2.9)

## 목차

1. [Server vs Client Components 선택 기준](#1-server-vs-client-components-선택-기준)
2. [Server Component 데이터 페칭](#2-server-component-데이터-페칭)
3. [Streaming과 Suspense](#3-streaming과-suspense)
4. [Server ↔ Client 컴포넌트 합성 패턴](#4-server--client-컴포넌트-합성-패턴)
5. [주요 파일 컨벤션](#5-주요-파일-컨벤션)

---

## 1. Server vs Client Components 선택 기준

| 필요한 것                                  | 선택       |
| ------------------------------------------ | ---------- |
| 상태(`useState`), 이벤트 핸들러(`onClick`) | **Client** |
| `useEffect`, lifecycle                     | **Client** |
| 브라우저 API (`localStorage`, `window`)    | **Client** |
| TanStack Query 훅, custom hooks            | **Client** |
| DB/API 직접 호출                           | **Server** |
| API 키, 시크릿 사용                        | **Server** |
| JS 번들 크기 최소화                        | **Server** |
| 빠른 FCP, 점진적 스트리밍                  | **Server** |

**기본값:** layout.tsx, page.tsx는 Server Component. `'use client'` 선언 시 Client Component.

```tsx
// Server Component (default)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  return <LikeButton likes={post.likes} />; // Client Component에 props 전달
}

// Client Component
('use client');
export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

> `'use client'`는 **모듈 그래프 경계**를 선언함. 선언된 파일과 그 import 전체가 클라이언트 번들에 포함됨.

---

## 2. Server Component 데이터 페칭

### fetch API

```tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/posts');
  const posts = await data.json();
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

- 동일한 `fetch` 요청은 컴포넌트 트리 내에서 **자동 메모이제이션**됨
- 기본적으로 캐시 안 됨 → `use cache` 디렉티브 또는 `<Suspense>`로 처리

### 병렬 페칭 (Promise.all)

```tsx
export default async function Page({ params }) {
  const { username } = await params;

  // 동시에 요청 시작
  const artistData = getArtist(username);
  const albumsData = getAlbums(username);

  // 둘 다 완료될 때까지 대기
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  );
}
```

> `Promise.allSettled` — 하나 실패해도 나머지 결과 사용 가능

### React.cache로 데이터 공유

```tsx
// lib/user.ts
import { cache } from 'react';

export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user');
  return res.json();
});
// 같은 요청 내에서 여러 번 호출해도 1번만 fetch
```

---

## 3. Streaming과 Suspense

### loading.js — 전체 라우트 스트리밍

```
app/posts/
  page.tsx
  loading.tsx   ← 자동으로 page.tsx를 <Suspense>로 감쌈
```

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return <div>Loading...</div>; // 또는 Skeleton UI
}
```

### Suspense — 부분 스트리밍

```tsx
import { Suspense } from 'react';

export default function BlogPage() {
  return (
    <div>
      <header>
        <h1>Blog</h1>
      </header>{' '}
      {/* 즉시 표시 */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList /> {/* 데이터 준비되면 스트리밍 */}
      </Suspense>
    </div>
  );
}
```

### 순차 페칭 + Suspense

```tsx
export default async function Page({ params }) {
  const artist = await getArtist(params.username);

  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading playlists...</div>}>
        <Playlists artistID={artist.id} /> {/* artist 데이터 준비 후 렌더 */}
      </Suspense>
    </>
  );
}

async function Playlists({ artistID }: { artistID: string }) {
  const playlists = await getArtistPlaylists(artistID);
  return (
    <ul>
      {playlists.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

---

## 4. Server ↔ Client 컴포넌트 합성 패턴

### props로 데이터 전달

```tsx
// Server Component → Client Component로 직렬화 가능한 값만 props로 전달
<LikeButton likes={post.likes} />
```

> Props는 반드시 직렬화 가능해야 함 (함수 전달 불가, Date는 string으로 변환)

### children으로 Server Component 합성

```tsx
// Client Component가 Server Component를 children으로 받는 패턴
'use client';
export default function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}

// Server Component에서 조합
export default function Page() {
  return (
    <Modal>
      <Cart /> {/* Server Component — 서버에서 렌더됨 */}
    </Modal>
  );
}
```

### Context Provider 패턴

```tsx
// app/theme-provider.tsx — Client Component로 래핑
'use client';
import { createContext } from 'react';
export const ThemeContext = createContext({});
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}

// app/layout.tsx — Server Component에서 Provider 사용 가능
import ThemeProvider from './theme-provider';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

> Context는 Server Component에서 직접 사용 불가 → Client Component로 감싸야 함

### 서버 전용 코드 보호

```ts
import 'server-only'; // Client Component에서 import 시 빌드 에러

export async function getData() {
  const res = await fetch('https://api.example.com/data', {
    headers: { authorization: process.env.API_KEY },
  });
  return res.json();
}
```

---

## 5. 주요 파일 컨벤션

| 파일            | 역할                                                   |
| --------------- | ------------------------------------------------------ |
| `page.tsx`      | 라우트의 고유 UI, 라우트를 공개적으로 접근 가능하게 함 |
| `layout.tsx`    | 여러 페이지가 공유하는 UI. 상태 보존, 리렌더 없음      |
| `loading.tsx`   | Suspense fallback UI (자동으로 page를 Suspense로 감쌈) |
| `error.tsx`     | Error Boundary. `'use client'` 필수                    |
| `not-found.tsx` | `notFound()` 호출 시 표시                              |
| `route.ts`      | API Route Handler (GET, POST 등)                       |
| `template.tsx`  | layout과 유사하지만 매 내비게이션마다 새 인스턴스 생성 |

### 동적 라우트

```tsx
// app/profile/[userId]/page.tsx
export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params; // Next.js 15+ params는 Promise
  // ...
}
```

### Route Handler

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // ...
}
```

### 주요 함수

| 함수                   | 사용 위치     | 설명                    |
| ---------------------- | ------------- | ----------------------- |
| `cookies()`            | Server        | 쿠키 읽기/쓰기          |
| `headers()`            | Server        | 요청 헤더 읽기          |
| `redirect(url)`        | Server        | 리다이렉트              |
| `notFound()`           | Server        | 404 표시                |
| `useRouter()`          | Client        | 프로그래매틱 내비게이션 |
| `useParams()`          | Client        | 동적 라우트 파라미터    |
| `usePathname()`        | Client        | 현재 pathname           |
| `useSearchParams()`    | Client        | URL search params       |
| `revalidatePath(path)` | Server Action | 특정 경로 캐시 무효화   |
