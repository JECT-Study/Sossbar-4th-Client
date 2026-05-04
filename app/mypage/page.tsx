import type { Metadata } from 'next';

import { MypageForm } from './mypage-form';

export const metadata: Metadata = {
  title: '마이페이지',
};

const MypagePage = () => {
  return (
    <section className="min-h-0 flex-1" aria-label="마이페이지">
      <MypageForm />
    </section>
  );
};

export default MypagePage;
