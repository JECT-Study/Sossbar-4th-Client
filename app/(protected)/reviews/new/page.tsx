import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { fetchReviewFormData, ReviewWriteContent, reviewKeys } from '@/features/review';
import { fetchReviewValidation } from '@/features/review/api/fetchers';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

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

type ReviewNewPageProps = {
  searchParams: Promise<{ projectId?: string; revieweeId?: string }>;
};

const ReviewNewFallback = () => (
  <div className="border-divider-gray-light bg-surface-white flex min-h-[240px] w-full items-center justify-center border-b">
    <p className="text-body-base text-text-subtle">화면을 불러오는 중…</p>
  </div>
);

const ReviewNewPage = async ({ searchParams }: ReviewNewPageProps) => {
  const { projectId: rawProjectId, revieweeId: rawRevieweeId } = await searchParams;

  const projectId = parsePositiveInt(rawProjectId ?? '');
  const revieweeId = parsePositiveInt(rawRevieweeId ?? '');

  if (projectId === null || revieweeId === null) {
    return notFound();
  }

  const cookieStore = await cookies();

  try {
    const validation = await fetchReviewValidation(projectId, revieweeId, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (!validation.canReview) {
      return notFound();
    }
  } catch {
    return notFound();
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reviewKeys.formData(),
    queryFn: fetchReviewFormData,
  });

  return (
    <section className="min-h-0 flex-1" aria-label="후기 작성">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ReviewNewFallback />}>
          <ReviewWriteContent />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
};

export default ReviewNewPage;
