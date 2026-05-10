import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview } from './fetchers';
import { invalidateReviewListQueries } from './invalidate-review-queries';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      void invalidateReviewListQueries(queryClient);
    },
  });
};
