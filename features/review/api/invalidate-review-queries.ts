import type { QueryClient } from '@tanstack/react-query';

import { reviewKeys } from './queries';

/** 리뷰 목록 등 목록 쿼리가 바뀌었을 때 */
export const invalidateReviewListQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
