import type { Tag } from '@/features/tag';

import type { Review, ReviewFormData, ReviewPosition, Spectrum, UserPosition } from './review.types';

/** POST /api/v1/reviews 작성 폼에서 선택 가능한 직군 (최대 2개) */
export const REVIEW_POSITION_LABELS: Record<ReviewPosition, string> = {
  FE: '프론트엔드',
  BE: '백엔드',
  PM: 'PM',
  PD: 'PD',
  AI: 'AI',
};

export const REVIEW_POSITIONS = Object.keys(REVIEW_POSITION_LABELS) as ReviewPosition[];

/** 과거 스키마(UserPosition)로 저장된 후기의 직군 표시 라벨 */
const USER_POSITION_LABELS: Record<UserPosition, string> = {
  FRONTEND: '프론트엔드',
  BACKEND: '백엔드',
  PM: 'PM',
  PD: 'PD',
  AI: 'AI',
  QA: 'QA',
  ETC: '기타',
};

export const getUserPositionLabel = (position: UserPosition, detailPosition?: string): string => {
  if (position === 'ETC' && detailPosition?.trim()) {
    return detailPosition.trim();
  }

  return USER_POSITION_LABELS[position];
};

/** GET /api/v1/form-data — 백엔드 FormDataResDto */
interface FormDataTagApi {
  tagId: number;
  tagName: string;
}

interface FormDataSpectrumAxisApi {
  spectrumAxisId: number;
  leftLabel: string;
  rightLabel: string;
}

export interface ReviewFormDataApiResponse {
  tags: FormDataTagApi[];
  spectrumAxes: FormDataSpectrumAxisApi[];
}

const mapTag = (tag: FormDataTagApi): Tag | null => {
  const name = tag.tagName.trim();
  if (!name) {
    return null;
  }
  return { tagId: tag.tagId, name };
};

const mapSpectrumAxis = (axis: FormDataSpectrumAxisApi): Spectrum => ({
  spectrumId: axis.spectrumAxisId,
  leftLabel: axis.leftLabel,
  rightLabel: axis.rightLabel,
});

export const mapReviewFormDataFromApi = (raw: ReviewFormDataApiResponse): ReviewFormData => {
  const tags = raw.tags.map(mapTag).filter((tag): tag is Tag => tag != null);
  const spectrums = raw.spectrumAxes.map(mapSpectrumAxis);
  return { tags, spectrums };
};

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
