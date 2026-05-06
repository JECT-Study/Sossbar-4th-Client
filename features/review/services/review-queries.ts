import { useQuery } from '@tanstack/react-query';

import { fetchReviewFormData, fetchReviews, fetchSpectrumsByProject, fetchTagsByProject } from './review-api';

export const reviewKeys = {
  all: ['review'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  formData: () => [...reviewKeys.all, 'formData'] as const,
  tagsByProject: (projectId: number) => [...reviewKeys.all, 'tags', projectId] as const,
  spectrumsByProject: (projectId: number) => [...reviewKeys.all, 'spectrums', projectId] as const,
};

export const useReviews = () =>
  useQuery({
    queryKey: reviewKeys.lists(),
    queryFn: fetchReviews,
  });

export const useReviewFormData = () =>
  useQuery({
    queryKey: reviewKeys.formData(),
    queryFn: fetchReviewFormData,
  });

export const useTagsByProject = (projectId: number) =>
  useQuery({
    queryKey: reviewKeys.tagsByProject(projectId),
    queryFn: () => fetchTagsByProject(projectId),
  });

export const useSpectrumsByProject = (projectId: number) =>
  useQuery({
    queryKey: reviewKeys.spectrumsByProject(projectId),
    queryFn: () => fetchSpectrumsByProject(projectId),
  });
