import { Suspense } from 'react';

import { ReviewWriteContent } from '@/features/review';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '후기 작성',
};

const ReviewNewFallback = () => (
  <div className="border-divider-gray-light bg-surface-white flex min-h-[240px] w-full items-center justify-center border-b">
    <p className="text-body-base text-text-subtle">화면을 불러오는 중…</p>
  </div>
);

const ReviewNewPage = () => {
  return (
    <section className="min-h-0 flex-1" aria-label="후기 작성">
      <Suspense fallback={<ReviewNewFallback />}>
        <ReviewWriteContent />
      </Suspense>
    </section>
  );
};

export default ReviewNewPage;
