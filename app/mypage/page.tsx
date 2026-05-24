import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchProfile } from '@/features/mypage/apis/fetch-profile.api';
import { MypageForm } from '@/features/mypage/components/mypage-form';
import { mypageKeys } from '@/features/mypage/mypage.query-key';
import { initMockServer, isServerMockEnabled } from '@/mocks/init-server';
import { getQueryClient } from '@/shared/lib/get-query-client';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '마이페이지',
};

const Page = async () => {
  await initMockServer();

  const queryClient = getQueryClient();
  const hasApiOrigin = Boolean(process.env.NEXT_PUBLIC_API_ORIGIN?.trim());
  const canPrefetchOnServer = hasApiOrigin || isServerMockEnabled();

  // NOTE: API origin이 없더라도 SSR용 MSW가 활성화된 경우에는 서버 prefetch를 허용합니다.
  if (canPrefetchOnServer) {
    await queryClient.prefetchQuery({
      queryKey: mypageKeys.all,
      queryFn: () => fetchProfile(),
    });
  }

  return (
    <section className="min-h-0 flex-1" aria-label="마이페이지">
      <div className="border-divider-gray-light bg-surface-white w-full border-b py-8">
        <h1 className="text-heading-2xl text-text-basic text-center font-bold">마이페이지</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MypageForm />
      </HydrationBoundary>
    </section>
  );
};

export default Page;
