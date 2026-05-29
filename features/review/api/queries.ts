import { useQuery } from '@tanstack/react-query';

import {
  fetchProjectReviews,
  fetchReceivedTags,
  fetchReceivedTagsByProject,
  fetchReviewFormData,
  fetchReviews,
  fetchSpectrum,
  fetchSpectrumByProject,
} from './fetchers';
import { reviewKeys } from './query-keys';

export const useUserReviews = (userId: number) =>
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

export const useProjectReviews = (userId: number, projectId: number) =>
  useQuery({
    queryKey: reviewKeys.projectReviews(userId, projectId),
    queryFn: () => fetchProjectReviews(userId, projectId),
    enabled: userId > 0 && projectId > 0,
  });

export const useSpectrum = ({ userId, projectId }: { userId: number; projectId?: number }) =>
  useQuery({
    queryKey: reviewKeys.spectrum(userId, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userId) : fetchSpectrumByProject(userId, projectId)),
    enabled: userId > 0 && (projectId === undefined || projectId > 0),
  });
