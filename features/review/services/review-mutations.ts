import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview } from './review-api';
import { reviewKeys } from './review-queries';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};
