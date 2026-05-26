import { apiRequest } from '@/shared/lib/api';

import type { CreateReviewApiBody, CreateReviewRequest, Review, ReviewFormData } from '../types/review';
import type { SpectrumStats } from '../types/spectrum';
import type { ReceivedTags } from '../types/tag';

const toCreateReviewApiBody = (data: CreateReviewRequest): CreateReviewApiBody => {
  const improvement = data.improvement.trim();

  return {
    reviewReqDto: {
      projectId: data.projectId,
      revieweeId: data.revieweeId,
      positiveFeedback: data.praise,
      ...(improvement.length > 0 ? { negativeFeedback: improvement } : {}),
      tagIds: data.tagIds,
    },
    spectrumReqDtos: data.spectrums.map((spectrum) => ({
      spectrumAxisId: spectrum.spectrumId,
      spectrumStrength: spectrum.value,
    })),
  };
};

export const fetchReviewFormData = (): Promise<ReviewFormData> => apiRequest<ReviewFormData>('/form-data');

export const fetchReviews = (userId: number): Promise<Review[]> => apiRequest<Review[]>(`/users/${userId}/reviews`);

export const fetchReceivedTags = (userId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}`);

export const fetchReceivedTagsByProject = (userId: number, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}/${projectId}`);

export const fetchSpectrumStats = (userId: number): Promise<SpectrumStats> =>
  apiRequest<SpectrumStats>(`/reviews/spectrums/${userId}`);

export const fetchSpectrumStatsByProject = (userId: number, projectId: number): Promise<SpectrumStats> =>
  apiRequest<SpectrumStats>(`/reviews/spectrums/${userId}/${projectId}`);

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: toCreateReviewApiBody(data) });
