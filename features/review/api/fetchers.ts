import { apiRequest } from '@/shared/lib/api';

import type {
  CreateReviewApiBody,
  CreateReviewRequest,
  Review,
  ReviewFormData,
  SpectrumWithAverage,
  Tag,
} from '../types/review';

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

export const fetchReviews = (): Promise<Review[]> => apiRequest<Review[]>('/reviews');

export const fetchTagsByProject = (projectId: number): Promise<Tag[]> =>
  apiRequest<Tag[]>(`/reviews/tags/${projectId}`);

export const fetchSpectrumsByProject = (projectId: number): Promise<SpectrumWithAverage[]> =>
  apiRequest<SpectrumWithAverage[]>(`/reviews/spectrums/${projectId}`);

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: toCreateReviewApiBody(data) });
