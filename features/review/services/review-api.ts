import type { CreateReviewRequest, Review, ReviewFormData, SpectrumWithAverage, Tag } from '../types/review';

const BASE = '/api/v1';

export const fetchReviewFormData = async (): Promise<ReviewFormData> => {
  const res = await fetch(`${BASE}/form-data`);
  if (!res.ok) {
    throw new Error('Failed to fetch review form data');
  }
  return res.json() as Promise<ReviewFormData>;
};

export const fetchReviews = async (): Promise<Review[]> => {
  const res = await fetch(`${BASE}/reviews`);
  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return res.json() as Promise<Review[]>;
};

export const fetchTagsByProject = async (projectId: number): Promise<Tag[]> => {
  const res = await fetch(`${BASE}/reviews/tags/${projectId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch tags');
  }
  return res.json() as Promise<Tag[]>;
};

export const fetchSpectrumsByProject = async (projectId: number): Promise<SpectrumWithAverage[]> => {
  const res = await fetch(`${BASE}/reviews/spectrums/${projectId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch spectrums');
  }
  return res.json() as Promise<SpectrumWithAverage[]>;
};

export const createReview = async (data: CreateReviewRequest): Promise<void> => {
  const res = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create review');
  }
};
