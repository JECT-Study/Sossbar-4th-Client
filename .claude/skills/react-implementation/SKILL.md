---
name: react-implementation
description: Sossbar React/Next.js 구현 패턴 스킬. implementer 에이전트가 컴포넌트, 훅, API 함수, Zod 스키마를 작성할 때 사용.
---

# React/Next.js 구현 패턴

## 컴포넌트 패턴

```tsx
// 화살표 함수 + named export (default export 금지)
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';
import { cva } from 'class-variance-authority';

const cardVariants = cva('base-class', {
  variants: {
    size: { sm: 'p-2', md: 'p-4' },
  },
  defaultVariants: { size: 'md' },
});

interface ProfileCardProps extends ComponentProps<'div'> {
  userId: string;
  size?: 'sm' | 'md';
}

export const ProfileCard = ({ userId, size, className, ...props }: ProfileCardProps) => {
  return <div className={cn(cardVariants({ size }), className)} {...props} />;
};
```

## TanStack Query 패턴

```ts
// query-keys.ts
export const profileKeys = {
  all: ['profile'] as const,
  byId: (id: string) => [...profileKeys.all, id] as const,
};

// queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchProfileById } from './fetch-profile-by-id';

export const profileByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: profileKeys.byId(id),
    queryFn: () => fetchProfileById(id),
  });

// use-profile.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { profileByIdQueryOptions } from '../api/queries';

export const useProfile = (id: string) => {
  return useSuspenseQuery(profileByIdQueryOptions(id));
};
```

## API 함수 패턴

```ts
// fetch-profile-by-id.ts
import { apiClient } from '@/shared/lib/api';
import { profileSchema } from '../types/profile.types';

export const fetchProfileById = async (id: string) => {
  const res = await apiClient.get(`/profiles/${id}`);
  return profileSchema.parse(res.data);
};
```

## Zod 스키마 패턴

```ts
// profile.types.ts
import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string().optional(),
});

export type Profile = z.infer<typeof profileSchema>;
```

## Mutation 패턴

```ts
// mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from './update-profile';
import { profileKeys } from './query-keys';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.byId(variables.id) });
    },
  });
};
```

## 자주 쓰는 shared 컴포넌트

- `@/shared/components/button` — Button 컴포넌트
- `@/shared/components/input` — Input 컴포넌트
- `@/shared/components/dialog` — Dialog 컴포넌트
- `@/shared/lib/cn` — cn() 유틸
- `@/shared/lib/url` — URL 유틸
- `@/shared/lib/login-modal` — 로그인 모달 유틸

## import 순서

```ts
// 1. builtin
// 2. external (react, next, @tanstack 등)
// 3. internal (@/features, @/shared, @/app)
// 4. type imports
import type { ... } from '...';
// 5. index imports
// 6. unknown
```

## 참고 문서 (필요할 때만 읽을 것)

| 주제                        | 파일                                        | 읽어야 할 때                                                                  |
| --------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| TanStack Query SSR 기본     | `references/tanstack-query-ssr.md`          | Hydration API, prefetch + dehydrate/hydrate 패턴 구현 시                      |
| TanStack Query Advanced SSR | `references/tanstack-query-advanced-ssr.md` | Server Component에서 프리페치, 스트리밍, pending 쿼리 dehydrate 구현 시       |
| Next.js App Router          | `references/nextjs-app-router.md`           | Server/Client Component 경계 설계, 데이터 페칭, Suspense, 파일 컨벤션 확인 시 |
