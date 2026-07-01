import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { buildReviewRequestDescription } from '@/features/profile';
import { fetchReviewFormData, fetchReviewValidation, reviewKeys, WriteReviewFlow } from '@/features/review';
import { SHARE_INVITER_NAME_PARAM } from '@/shared/constants/share-query';
import { buildShareOgMetadata } from '@/shared/lib/build-share-metadata';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';
import { parseShareDisplayName } from '@/shared/lib/parse-share-display-name';

import type { Metadata } from 'next';

type ReviewWritePageMetadataProps = {
  searchParams: Promise<{
    projectId?: string;
    revieweeId?: string;
    reviewee?: string;
    [SHARE_INVITER_NAME_PARAM]?: string;
  }>;
};

export const generateMetadata = async ({ searchParams }: ReviewWritePageMetadataProps): Promise<Metadata> => {
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

  const path = pathSearchParams.size > 0 ? `/reviews/write?${pathSearchParams.toString()}` : '/reviews/write';

  return buildShareOgMetadata({
    description,
    path,
  });
};

type ReviewWritePageProps = {
  searchParams: Promise<{ projectId?: string; revieweeId?: string; reviewee?: string }>;
};

const ReviewWritePage = async ({ searchParams }: ReviewWritePageProps) => {
  const { projectId: rawProjectId, revieweeId: rawRevieweeId, reviewee } = await searchParams;

  const projectId = parsePositiveInt(rawProjectId ?? '');
  const revieweeId = parsePositiveInt(rawRevieweeId ?? '');

  if (projectId === null || revieweeId === null) {
    return notFound();
  }

  const revieweeName = parseShareDisplayName(reviewee) ?? '';

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
    <div className="flex min-h-[calc(100vh-73px-168px)] flex-col items-center bg-white px-4 py-15">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WriteReviewFlow projectId={projectId} revieweeId={revieweeId} revieweeName={revieweeName} />
      </HydrationBoundary>
    </div>
  );
};

export default ReviewWritePage;
