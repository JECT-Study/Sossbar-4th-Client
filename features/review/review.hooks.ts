'use client';

import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { projectKeys } from '@/features/project';

import {
  createReview,
  fetchProjectReviews,
  fetchReviewFormData,
  fetchReviewValidation,
  fetchReviews,
  reviewKeys,
} from './review.api';

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

export const useUserReviews = (userLink: string) =>
  useSuspenseQuery({
    queryKey: reviewKeys.reviews(userLink),
    queryFn: () => fetchReviews(userLink),
  });

export const useReviewFormData = () =>
  useQuery({
    queryKey: reviewKeys.formData(),
    queryFn: fetchReviewFormData,
  });

export const useProjectReviews = (userLink: string, projectId: number) =>
  useQuery({
    queryKey: reviewKeys.projectReviews(userLink, projectId),
    queryFn: () => fetchProjectReviews(userLink, projectId),
    enabled: userLink.length > 0 && projectId > 0,
    throwOnError: false,
  });

export const useReviewValidation = (projectId: number, revieweeId: number) =>
  useQuery({
    queryKey: reviewKeys.validate(projectId, revieweeId),
    queryFn: () => fetchReviewValidation(projectId, revieweeId),
    enabled: projectId > 0 && revieweeId > 0,
    throwOnError: false,
  });
