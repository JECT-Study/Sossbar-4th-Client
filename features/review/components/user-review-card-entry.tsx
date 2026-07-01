import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { UserReviewCardGate } from './user-review-card-gate';
import { fetchReviews, reviewKeys } from '../review.api';

interface Props {
  userId: number;
}

export const UserReviewCardEntry = async ({ userId }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reviewKeys.reviews(userId),
    queryFn: () => fetchReviews(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserReviewCardGate userId={userId} />
    </HydrationBoundary>
  );
};
