import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectKeys } from '@/features/project/api/queries';

import { createReview } from './fetchers';
import { reviewKeys } from './queries';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};
