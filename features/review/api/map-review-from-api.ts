import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { Review } from '../types/review';

/** GET /api/v1/users/{userId}/reviews — CommonReviewResDto */
export type ReviewApiResponse = {
  reviewId: number;
  projectName: string;
  host: string;
  projectImage: string | null;
  createdAt: string;
  positiveFeedback: string;
  negativeFeedback?: string;
  reviewerNickname?: string;
};

export const mapReviewFromApi = (raw: ReviewApiResponse): Review => ({
  reviewId: raw.reviewId,
  projectName: raw.projectName,
  host: raw.host,
  projectImage: raw.projectImage,
  reviewedAt: formatIsoDateToDots(raw.createdAt),
  positiveFeedback: raw.positiveFeedback,
  ...(raw.negativeFeedback != null && raw.negativeFeedback.length > 0
    ? { negativeFeedback: raw.negativeFeedback }
    : {}),
  reviewerNickname: raw.reviewerNickname?.trim() || '익명의 동료',
});

export const mapReviewsFromApi = (items: ReviewApiResponse[]): Review[] => items.map(mapReviewFromApi);
