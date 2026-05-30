import { apiRequest } from '@/shared/lib/api';

import type { CreateReviewRequest, Review, ReviewFormData } from '../types/review';
import type { SpectrumInfo } from '../types/spectrum';
import type { ReceivedTags } from '../types/tag';

import { mapReviewFormDataFromApi, type ReviewFormDataApiResponse } from './map-form-data';

const toCreateReviewFormData = (data: CreateReviewRequest): FormData => {
  const praise = data.praise.trim();
  const improvement = data.improvement.trim();

  const reviewReqDto = {
    projectId: data.projectId,
    revieweeId: data.revieweeId,
    ...(praise.length > 0 ? { positiveFeedback: praise } : {}),
    ...(improvement.length > 0 ? { negativeFeedback: improvement } : {}),
    tagIds: data.tagIds,
  };

  const spectrumReqDtos = data.spectrums.map((spectrum) => ({
    spectrumAxisId: spectrum.spectrumId,
    spectrumStrength: spectrum.value,
  }));

  const formData = new FormData();
  formData.append('reviewReqDto', new Blob([JSON.stringify(reviewReqDto)], { type: 'application/json' }));
  formData.append('spectrumReqDtos', new Blob([JSON.stringify(spectrumReqDtos)], { type: 'application/json' }));
  return formData;
};

export const fetchReviewFormData = async (): Promise<ReviewFormData> => {
  const raw = await apiRequest<ReviewFormDataApiResponse>('/form-data');
  return mapReviewFormDataFromApi(raw);
};

export const fetchReviews = (userId: number): Promise<Review[]> => apiRequest<Review[]>(`/users/${userId}/reviews`);

export const fetchProjectReviews = (userId: number, projectId: number): Promise<Review[]> =>
  apiRequest<Review[]>(`/users/${userId}/projects/${projectId}/reviews`);

export const fetchReceivedTags = (userId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}`);

export const fetchReceivedTagsByProject = (userId: number, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}/${projectId}`);

export const fetchSpectrum = (userId: number): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userId}`);

export const fetchSpectrumByProject = (userId: number, projectId: number): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userId}/${projectId}`);

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: toCreateReviewFormData(data) });
