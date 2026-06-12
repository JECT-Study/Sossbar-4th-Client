import type { Review } from '../types/review';

/** GET /api/v1/users/:userId/reviews — 백엔드 커서 페이지 응답 */
export interface UserReviewsApiResponse {
  reviews: Review[];
  nextCursor: string | null;
  hasNext: boolean;
}

export const mapUserReviewsFromApi = (raw: UserReviewsApiResponse | Review[]): Review[] => {
  if (Array.isArray(raw)) {
    return raw;
  }

  return raw.reviews ?? [];
};
