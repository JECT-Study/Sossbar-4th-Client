import { apiRequest } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type { ReviewApiRaw, ReviewFormDataApiResponse, UserReviewsApiResponse } from './review.lib';
import type { CreateReviewRequest, Review, ReviewFormData, ReviewPosition, ReviewValidation } from './review.types';

import { mapReviewFormDataFromApi, mapUserReviewsFromApi } from './review.lib';

export const reviewKeys = {
  all: ['review'] as const,
  reviews: (userId: number) => [...reviewKeys.all, 'reviews', userId] as const,
  formData: () => [...reviewKeys.all, 'formData'] as const,
  projectReviews: (userId: number, projectId: number) => [...reviewKeys.all, 'reviews', userId, projectId] as const,
  validate: (projectId: number, revieweeId: number) => [...reviewKeys.all, 'validate', projectId, revieweeId] as const,
};

interface CreateReviewReviewReqDto {
  projectId: number;
  revieweeId: number;
  feedback: string;
  projectPositions: ReviewPosition[];
  tagIds: number[];
}

interface CreateReviewSpectrumReqDto {
  spectrumAxisId: number;
  spectrumStrength: number;
}

/** POST /api/v1/reviews 요청 본문 (백엔드 ReviewCreateReqDto) */
interface CreateReviewApiBody {
  reviewReqDto: CreateReviewReviewReqDto;
  spectrumReqDtos: CreateReviewSpectrumReqDto[];
}

const toCreateReviewBody = (data: CreateReviewRequest): CreateReviewApiBody => ({
  reviewReqDto: {
    projectId: data.projectId,
    revieweeId: data.revieweeId,
    feedback: data.feedback.trim(),
    projectPositions: data.projectPositions,
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
