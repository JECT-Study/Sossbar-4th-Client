import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { ReviewWriteContent } from './review-write-content';
import { fetchReviewFormData } from '../api/fetchers';
import { reviewKeys } from '../api/query-keys';

export const ReviewFormDataStream = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: reviewKeys.formData(),
    queryFn: fetchReviewFormData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewWriteContent />
    </HydrationBoundary>
  );
};
