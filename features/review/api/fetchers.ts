import { apiRequest } from '@/shared/lib/api';

import type { CreateReviewRequest, Review, ReviewFormData } from '../types/review';
import type { SpectrumInfo } from '../types/spectrum';
import type { ReceivedTags } from '../types/tag';

export const fetchReviewFormData = (): Promise<ReviewFormData> => apiRequest<ReviewFormData>('/form-data');

export const fetchReviews = (userId: number): Promise<Review[]> => apiRequest<Review[]>(`/users/${userId}/reviews`);

export const fetchReceivedTags = (userId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}`);

export const fetchReceivedTagsByProject = (userId: number, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}/${projectId}`);

export const fetchSpectrum = (userId: number): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userId}`);

export const fetchSpectrumByProject = (userId: number, projectId: number): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userId}/${projectId}`);

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: data });
