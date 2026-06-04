import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchReviews } from '@/features/review/api/fetchers';
import { reviewKeys } from '@/features/review/api/query-keys';
import { UserReviewContainerBoundary } from '@/features/review/components/user-review-container-boundary';
import { getQueryClient } from '@/shared/lib/get-query-client';

type UserReviewStreamProps = {
  userId: number;
};

export const UserReviewStream = async ({ userId }: UserReviewStreamProps) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reviewKeys.reviews(userId),
    queryFn: () => fetchReviews(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserReviewContainerBoundary userId={userId} />
    </HydrationBoundary>
  );
};
