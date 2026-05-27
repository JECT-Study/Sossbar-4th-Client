import { Suspense } from 'react';

import { ReviewWriteContent } from '@/features/review';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sossbar - 프로젝트 동료 리뷰',
  description: '함께 프로젝트를 진행한 팀원에게 후기를 남겨보세요',
  openGraph: {
    title: 'Sossbar - 프로젝트 동료 리뷰',
    description: '함께 프로젝트를 진행한 팀원에게 후기를 남겨보세요',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sossbar - 프로젝트 동료 리뷰',
    description: '함께 프로젝트를 진행한 팀원에게 후기를 남겨보세요',
  },
};

const ReviewPageFallback = () => (
  <div className="border-divider-gray-light bg-surface-white flex min-h-[240px] w-full items-center justify-center border-b">
    <p className="text-body-base text-text-subtle">화면을 불러오는 중…</p>
  </div>
);

type ReviewPageProps = {
  params: Promise<{ id: string }>;
};

const ReviewPage = async ({ params }: ReviewPageProps) => {
  const { id } = await params;

  return (
    <section className="min-h-0 flex-1" aria-label={`후기 작성 ${id}`}>
      <Suspense fallback={<ReviewPageFallback />}>
        <ReviewWriteContent />
      </Suspense>
    </section>
  );
};

export default ReviewPage;
