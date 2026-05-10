import type { Metadata } from 'next';

import { MypageForm } from './mypage-form';

export const metadata: Metadata = {
  title: '마이페이지',
};

const MypagePage = () => {
  return (
    <section className="min-h-0 flex-1" aria-label="마이페이지">
      <div className="border-divider-gray-light bg-surface-white w-full border-b">
        <div className="mx-auto w-full max-w-[1200px] px-10">
          <div className="flex min-h-[152px] items-center justify-center py-8">
            <h1 className="text-heading-2xl text-text-basic text-center font-bold">마이페이지</h1>
          </div>
        </div>
      </div>
      <MypageForm />
    </section>
  );
};

export default MypagePage;
