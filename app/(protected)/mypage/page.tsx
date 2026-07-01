import { MypageBoundary } from '@/features/profile';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '마이페이지',
};

const Page = () => {
  return (
    <section className="min-h-0 flex-1 px-6 pb-20" aria-label="마이페이지">
      <MypageBoundary />
    </section>
  );
};

export default Page;
