import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview } from './fetchers';
import { reviewKeys } from './queries';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};
