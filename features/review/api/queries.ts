import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { fetchProjectReviews, fetchReviewFormData, fetchReviewValidation, fetchReviews } from './fetchers';
import { reviewKeys } from './query-keys';

export const useUserReviews = (userId: number) =>
  useSuspenseQuery({
    queryKey: reviewKeys.reviews(userId),
    queryFn: () => fetchReviews(userId),
  });

export const useReviewFormData = () =>
  useQuery({
    queryKey: reviewKeys.formData(),
    queryFn: fetchReviewFormData,
  });

export const useProjectReviews = (userId: number, projectId: number) =>
  useQuery({
    queryKey: reviewKeys.projectReviews(userId, projectId),
    queryFn: () => fetchProjectReviews(userId, projectId),
    enabled: userId > 0 && projectId > 0,
    throwOnError: false,
  });

export const useReviewValidation = (projectId: number, revieweeId: number) =>
  useQuery({
    queryKey: reviewKeys.validate(projectId, revieweeId),
    queryFn: () => fetchReviewValidation(projectId, revieweeId),
    enabled: projectId > 0 && revieweeId > 0,
    throwOnError: false,
  });
