import { apiRequest } from '@/shared/lib/api';

import type { CreateReviewRequest, ReceivedTags, Review, ReviewFormData, SpectrumStats } from './types';

export const fetchReviewFormData = (): Promise<ReviewFormData> => apiRequest<ReviewFormData>('/form-data');

export const fetchReviews = (): Promise<Review[]> => apiRequest<Review[]>('/reviews');

export const fetchReceivedTags = (userId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}`);

export const fetchReceivedTagsByProject = (userId: number, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}/${projectId}`);

export const fetchSpectrumStats = (userId: number): Promise<SpectrumStats> =>
  apiRequest<SpectrumStats>(`/reviews/spectrums/${userId}`);

export const fetchSpectrumStatsByProject = (userId: number, projectId: number): Promise<SpectrumStats> =>
  apiRequest<SpectrumStats>(`/reviews/spectrums/${userId}/${projectId}`);

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: data });
