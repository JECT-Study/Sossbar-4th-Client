import type { ReactNode } from 'react';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { authKeys } from '@/features/auth/api/auth.query-keys';
import { fetchMeOptional } from '@/features/auth/api/fetch-me-optional';
import { Header } from '@/features/auth/components/header/header';
import { LoginModal } from '@/shared/components/dialog/login-modal';
import { GoogleAnalyticsPageView } from '@/shared/components/google-analytics-page-view';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { MainLayoutClient } from './main-layout-client';

interface Props {
  children: ReactNode;
}

/**
 * 앱 전역 페이지 틀 (Server Component).
 * myProfile prefetch + HydrationBoundary로 전역 Client subtree에 suspense query 캐시를 공급한다.
 */
export const MainLayout = async ({ children }: Props) => {
  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: authKeys.me,
    queryFn: () => fetchMeOptional({ headers: { Cookie: cookieStore.toString() } }),
  });

  return (
    <>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView />
      </Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MainLayoutClient header={<Header />}>{children}</MainLayoutClient>
        <Suspense fallback={null}>
          <LoginModal />
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

// features/profile -> my-soss로 이동
