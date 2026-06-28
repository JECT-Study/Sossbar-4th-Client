import { apiRequest } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type { CreateReviewRequest, Review, ReviewFormData, ReviewValidation } from '../types/review';

import { mapReviewFormDataFromApi, type ReviewFormDataApiResponse } from './map-form-data';
import { mapUserReviewsFromApi, type ReviewApiRaw, type UserReviewsApiResponse } from './map-user-reviews';

const toCreateReviewBody = (data: CreateReviewRequest) => ({
  reviewReqDto: {
    projectId: data.projectId,
    revieweeId: data.revieweeId,
    feedback: data.feedback.trim(),
    projectPosition: data.projectPosition,
    ...(data.projectDetailPosition ? { projectDetailPosition: data.projectDetailPosition } : {}),
    tagIds: data.tagIds,
  },
  spectrumReqDtos: data.spectrums.map((spectrum) => ({
    spectrumAxisId: spectrum.spectrumId,
    spectrumStrength: spectrum.value,
  })),
});

export const fetchReviewFormData = async (): Promise<ReviewFormData> => {
  const raw = await apiRequest<ReviewFormDataApiResponse>('/form-data');
  return mapReviewFormDataFromApi(raw);
};

export const fetchReviews = async (userId: number): Promise<Review[]> => {
  const raw = await apiRequest<UserReviewsApiResponse>(`/users/${userId}/reviews`);
  return mapUserReviewsFromApi(raw);
};

export const fetchProjectReviews = async (userId: number, projectId: number): Promise<Review[]> => {
  const raw = await apiRequest<ReviewApiRaw[]>(`/users/${userId}/projects/${projectId}/reviews`);
  return mapUserReviewsFromApi(raw);
};

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: toCreateReviewBody(data) });

export const fetchReviewValidation = (
  projectId: number,
  revieweeId: number,
  init?: ApiRequestOptions,
): Promise<ReviewValidation> => {
  const params = new URLSearchParams({ projectId: String(projectId), revieweeId: String(revieweeId) });
  return apiRequest<ReviewValidation>(`/reviews/validate?${params}`, init);
};
