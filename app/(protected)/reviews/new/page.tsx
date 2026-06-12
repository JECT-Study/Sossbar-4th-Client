import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { fetchProfileById } from '@/features/profile/api/fetch-profile-by-id';
import { buildReviewRequestDescription, PROFILE_SHARE_TITLE } from '@/features/profile/lib/profile-share-content';
import { fetchReviewFormData, ReviewWriteContent, reviewKeys } from '@/features/review';
import { fetchReviewValidation } from '@/features/review/api/fetchers';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

import type { Metadata } from 'next';

type ReviewNewPageMetadataProps = {
  searchParams: Promise<{ revieweeId?: string }>;
};

export const generateMetadata = async ({ searchParams }: ReviewNewPageMetadataProps): Promise<Metadata> => {
  const { revieweeId: rawRevieweeId } = await searchParams;
  const revieweeId = parsePositiveInt(rawRevieweeId ?? '');

  let description = buildReviewRequestDescription('');

  if (revieweeId !== null) {
    try {
      const cookieStore = await cookies();
      const profile = await fetchProfileById(revieweeId, { headers: { Cookie: cookieStore.toString() } });
      description = buildReviewRequestDescription(profile.username);
    } catch {
      // 유저 정보 조회 실패 시 기본 문구 유지
    }
  }

  return {
    title: PROFILE_SHARE_TITLE,
    description,
    openGraph: {
      title: PROFILE_SHARE_TITLE,
      description,
      type: 'website',
      images: [{ url: '/Sossbar_logo.png', alt: 'Sossbar' }],
    },
    twitter: {
      card: 'summary',
      title: PROFILE_SHARE_TITLE,
      description,
      images: ['/Sossbar_logo.png'],
    },
  };
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
