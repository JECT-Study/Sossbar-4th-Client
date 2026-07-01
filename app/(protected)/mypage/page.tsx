import { MypageBasicInfoBoundary } from '@/features/profile';

import type { Metadata } from 'next';

import { MyPageSkeleton } from './page.skeleton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '마이페이지',
};

const Page = () => {
  return (
    <section className="min-h-0 flex-1" aria-label="마이페이지">
      <div className="border-divider-gray-light bg-surface-white w-full border-b py-8">
        <h1 className="text-heading-2xl text-text-basic text-center font-bold">마이페이지</h1>
      </div>
      <MypageBasicInfoBoundary fallback={<MyPageSkeleton />} />
    </section>
  );
};

export default Page;
