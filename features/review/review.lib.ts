import type { Tag } from '@/features/tag';

import type { Review, ReviewFormData, Spectrum, UserPosition } from './review.types';

/** 스펙트럼 슬라이더 step(0~6, 중앙 제외) -> 백엔드 강도(1~6) */
export const spectrumStepToValue = (step: number): number => (step < 3 ? step + 1 : step);

/** 후기에 표시되는 직군 라벨 */
export const USER_POSITION_LABELS: Record<UserPosition, string> = {
  FE: '프론트엔드',
  BE: '백엔드',
  PM: '프로덕트 매니저',
  PD: '프로덕트 디자이너',
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
  reviewerProfileImageUrl?: string | null;
  projectPosition?: UserPosition;
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
  reviewerImageUrl: raw.reviewerProfileImageUrl ?? null,
  projectPosition: raw.projectPosition,
  projectStatus: raw.projectStatus,
});

export const mapUserReviewsFromApi = (raw: UserReviewsApiResponse | ReviewApiRaw[]): Review[] => {
  if (Array.isArray(raw)) {
    return raw.map(mapReviewFromApi);
  }
  return (raw.reviews ?? []).map(mapReviewFromApi);
};
