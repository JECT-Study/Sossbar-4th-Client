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

export const useReceivedTags = ({ userId, projectId }: { userId: number; projectId?: number }) =>
  useQuery({
    queryKey: reviewKeys.receivedTags(userId, projectId),
    queryFn: () =>
      projectId === undefined ? fetchReceivedTags(userId) : fetchReceivedTagsByProject(userId, projectId),
    enabled: userId > 0 && (projectId === undefined || projectId > 0),
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
