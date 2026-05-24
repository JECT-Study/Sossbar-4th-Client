import { useQuery } from '@tanstack/react-query';

import {
  fetchReceivedTags,
  fetchReceivedTagsByProject,
  fetchReviewFormData,
  fetchReviews,
  fetchSpectrumStats,
  fetchSpectrumStatsByProject,
} from './fetchers';
import { reviewKeys } from './query-keys';

export const useReviews = (userId: number) =>
  useQuery({
    queryKey: reviewKeys.reviews(userId),
    queryFn: () => fetchReviews(userId),
  });

export const useReviewFormData = () =>
  useQuery({
    queryKey: reviewKeys.formData(),
    queryFn: fetchReviewFormData,
  });

export const useReceivedTags = (userId: number) =>
  useQuery({
    queryKey: reviewKeys.receivedTags(userId),
    queryFn: () => fetchReceivedTags(userId),
  });

export const useReceivedTagsByProject = (userId: number, projectId: number) =>
  useQuery({
    queryKey: reviewKeys.receivedTagsByProject(userId, projectId),
    queryFn: () => fetchReceivedTagsByProject(userId, projectId),
  });

export const useSpectrumStats = (userId: number) =>
  useQuery({
    queryKey: reviewKeys.spectrumStats(userId),
    queryFn: () => fetchSpectrumStats(userId),
  });

export const useSpectrumStatsByProject = (userId: number, projectId: number) =>
  useQuery({
    queryKey: reviewKeys.spectrumStatsByProject(userId, projectId),
    queryFn: () => fetchSpectrumStatsByProject(userId, projectId),
  });
