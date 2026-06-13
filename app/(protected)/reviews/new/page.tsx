import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { buildReviewRequestDescription } from '@/features/profile/lib/profile-share-content';
import { fetchReviewFormData, ReviewWriteContent, reviewKeys } from '@/features/review';
import { fetchReviewValidation } from '@/features/review/api/fetchers';
import { SHARE_INVITER_NAME_PARAM } from '@/shared/constants/share-query';
import { buildShareOgMetadata } from '@/shared/lib/build-share-metadata';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';
import { parseShareDisplayName } from '@/shared/lib/parse-share-display-name';

import type { Metadata } from 'next';

type ReviewNewPageMetadataProps = {
  searchParams: Promise<{
    projectId?: string;
    revieweeId?: string;
    reviewee?: string;
    [SHARE_INVITER_NAME_PARAM]?: string;
  }>;
};

export const generateMetadata = async ({ searchParams }: ReviewNewPageMetadataProps): Promise<Metadata> => {
  const params = await searchParams;
  const inviterName = parseShareDisplayName(params[SHARE_INVITER_NAME_PARAM]);
  const revieweeName = parseShareDisplayName(params.reviewee);
  const displayName = inviterName ?? revieweeName ?? '';
  const description = buildReviewRequestDescription(displayName);

  const pathSearchParams = new URLSearchParams();
  if (params.projectId) {
    pathSearchParams.set('projectId', params.projectId);
  }
  if (params.revieweeId) {
    pathSearchParams.set('revieweeId', params.revieweeId);
  }
  if (revieweeName) {
    pathSearchParams.set('reviewee', revieweeName);
  }
  if (inviterName) {
    pathSearchParams.set(SHARE_INVITER_NAME_PARAM, inviterName);
  }

  const path = pathSearchParams.size > 0 ? `/reviews/new?${pathSearchParams.toString()}` : '/reviews/new';

  return buildShareOgMetadata({
    description,
    path,
  });
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
    // API 오류(401·네트워크·서버 장애)는 404로 처리하지 않고 폼을 표시; 제출 시 백엔드가 재검증한다.
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
