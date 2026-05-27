import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectKeys } from '@/features/project/api/queries';

import { createReview } from './fetchers';
import { reviewKeys } from './query-keys';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      // POST /reviews 성공 후, /projects 응답의 member.reviewWritten 상태가 갱신되도록 목록 쿼리를 새로 받는다.
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};
