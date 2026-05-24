import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import { MypageForm } from '@/features/mypage/components/mypage-form';
import { mypageKeys } from '@/features/mypage/mypage.query-key';
import { fetchProfile } from '@/features/profile/fetchers';
import { getQueryClient } from '@/shared/lib/get-query-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이페이지',
};

const Page = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: mypageKeys.all,
    queryFn: () => fetchProfile(),
  });

  return (
    <section className="min-h-0 flex-1" aria-label="마이페이지">
      <div className="border-divider-gray-light bg-surface-white w-full border-b py-8">
        <h1 className="text-heading-2xl text-text-basic text-center font-bold">마이페이지</h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MypageForm />
        </HydrationBoundary>
      </Suspense>
    </section>
  );
};

export default Page;
