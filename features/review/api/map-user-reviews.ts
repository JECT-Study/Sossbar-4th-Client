import type { Review, UserPosition } from '../types/review';

/** GET /api/v1/users/:userId/reviews — 백엔드 ReviewCursorResDto */
export interface UserReviewsApiResponse {
  reviews: ReviewApiRaw[];
  nextCursor: string | null;
  hasNext: boolean;
}

/** JECT5-4th-Server CommonReviewResDto / ReviewPrivateResDto / ReviewPublicResDto */
export interface ReviewApiRaw {
  reviewId: number;
  projectName?: string;
  host?: string;
  projectImage?: string | null;
  createdAt: string;
  feedback?: string;
  reviewerNickname?: string;
  projectPosition?: UserPosition;
  projectDetailPosition?: string;
  projectStatus?: Review['projectStatus'];
}

const normalizeText = (value: string | undefined): string => value?.trim() ?? '';

const normalizeCreatedAt = (value: string): string => {
  if (value.includes('T')) {
    return value;
  }
  return `${value}T00:00:00`;
};

export const mapReviewFromApi = (raw: ReviewApiRaw): Review => ({
  reviewId: raw.reviewId,
  projectName: raw.projectName ?? '',
  host: raw.host ?? '',
  projectImage: raw.projectImage ?? null,
  createdAt: normalizeCreatedAt(raw.createdAt),
  feedback: normalizeText(raw.feedback),
  reviewerNickname: normalizeText(raw.reviewerNickname) || '익명의 동료',
  projectPosition: raw.projectPosition,
  projectDetailPosition: raw.projectDetailPosition,
  projectStatus: raw.projectStatus,
});

export const mapUserReviewsFromApi = (raw: UserReviewsApiResponse | ReviewApiRaw[]): Review[] => {
  if (Array.isArray(raw)) {
    return raw.map(mapReviewFromApi);
  }
  return (raw.reviews ?? []).map(mapReviewFromApi);
};
