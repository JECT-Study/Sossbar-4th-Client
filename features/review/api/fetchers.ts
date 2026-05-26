import { apiRequest } from '@/shared/lib/api';

import type { CreateReviewRequest, Review, ReviewFormData } from '../types/review';
import type { SpectrumAxisInfo } from '../types/spectrum';
import type { ReceivedTags } from '../types/tag';

export const fetchReviewFormData = (): Promise<ReviewFormData> => apiRequest<ReviewFormData>('/form-data');

export const fetchReviews = (userId: number): Promise<Review[]> => apiRequest<Review[]>(`/users/${userId}/reviews`);

export const fetchReceivedTags = (userId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}`);

export const fetchReceivedTagsByProject = (userId: number, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}/${projectId}`);

type SpectrumResponse = { spectrumInfoResDtos: SpectrumAxisInfo[] };

export const fetchSpectrum = (userId: number): Promise<SpectrumAxisInfo[]> =>
  apiRequest<SpectrumResponse>(`/reviews/spectrums/${userId}`).then((res) => res.spectrumInfoResDtos);

export const fetchSpectrumByProject = (userId: number, projectId: number): Promise<SpectrumAxisInfo[]> =>
  apiRequest<SpectrumResponse>(`/reviews/spectrums/${userId}/${projectId}`).then((res) => res.spectrumInfoResDtos);

export const createReview = (data: CreateReviewRequest): Promise<void> =>
  apiRequest<void>('/reviews', { method: 'POST', body: data });
