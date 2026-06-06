import { PageContainer } from '@/shared/components/page-container';

import type { Metadata } from 'next';

import { NoticeExamplesClient } from './notice-examples-client';

export const metadata: Metadata = {
  title: 'Sossbar - 알림/안내 멘트 샘플',
  description: '알림·안내 UI 1차 디자인 샘플 (디자이너 검토용)',
  robots: { index: false, follow: false },
};

const NoticeExamplesPage = () => {
  return (
    <PageContainer className="mb-20">
      <NoticeExamplesClient />
    </PageContainer>
  );
};

export default NoticeExamplesPage;
