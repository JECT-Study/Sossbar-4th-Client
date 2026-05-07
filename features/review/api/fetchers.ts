import { apiRequest } from '@/shared/lib/api';

import type { CreateReviewRequest, Review, ReviewFormData, SpectrumWithAverage, Tag } from '../types/review';

export const fetchReviewFormData = (): Promise<ReviewFormData> => apiRequest<ReviewFormData>('/form-data');

export const fetchReviews = (): Promise<Review[]> => apiRequest<Review[]>('/reviews');

export const fetchTagsByProject = (projectId: number): Promise<Tag[]> =>
  apiRequest<Tag[]>(`/reviews/tags/${projectId}`);

export const fetchSpectrumsByProject = (projectId: number): Promise<SpectrumWithAverage[]> =>
  apiRequest<SpectrumWithAverage[]>(`/reviews/spectrums/${projectId}`);

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: data });
