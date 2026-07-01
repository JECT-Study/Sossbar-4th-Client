import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { UserReviewCardGate } from './user-review-card-gate';
import { fetchReviews, reviewKeys } from '../review.api';

interface Props {
  userLink: string;
}

export const UserReviewCardEntry = async ({ userLink }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reviewKeys.reviews(userLink),
    queryFn: () => fetchReviews(userLink),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserReviewCardGate userLink={userLink} />
    </HydrationBoundary>
  );
};
