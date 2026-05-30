'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectKeys } from '@/features/project/api/query-keys';
import { useSessionUser } from '@/shared/lib/session-user';

import { createReview } from './fetchers';
import { reviewKeys } from './query-keys';

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const sessionUser = useSessionUser();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: reviewKeys.spectrum(variables.revieweeId) });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.spectrum(variables.revieweeId, variables.projectId),
      });
      if (sessionUser?.userId != null && sessionUser.userId !== variables.revieweeId) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.spectrum(sessionUser.userId) });
      }
    },
  });
};
