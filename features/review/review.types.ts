import type { Tag } from '@/features/tag';

/**
 * 후기에 표시되는 직군. 백엔드가 과거에 이 값으로 저장한 후기를 여전히 내려줄 수 있어
 * POST /reviews 요청용 {@link ReviewPosition}과 별도로 유지한다.
 */
export type UserPosition = 'FRONTEND' | 'BACKEND' | 'PM' | 'PD' | 'AI' | 'QA' | 'ETC';

/** POST /api/v1/reviews reviewReqDto.projectPositions 아이템 enum */
export type ReviewPosition = 'FE' | 'BE' | 'PM' | 'PD' | 'AI';

export interface Review {
  reviewId: number;
  projectName: string;
  host: string;
  projectImage: string | null;
  createdAt: string;
  feedback: string;
  reviewerNickname: string;
  projectPosition?: UserPosition;
  projectDetailPosition?: string;
  projectStatus?: 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'; // 팀 확정 여부 필터링용
}

export interface Spectrum {
  spectrumId: number;
  leftLabel: string;
  rightLabel: string;
}

export interface SpectrumWithValue {
  spectrumId: number;
  value: number;
}

export interface ReviewFormData {
  tags: Tag[];
  spectrums: Spectrum[];
}

export interface CreateReviewRequest {
  projectId: number;
  revieweeId: number;
  feedback: string;
  /** 1~2개 선택 */
  projectPositions: ReviewPosition[];
  tagIds: number[];
  spectrums: SpectrumWithValue[];
}

export type ReviewValidReason =
  | 'VALID'
  | 'SELF_REVIEW'
  | 'REVIEWER_NOT_IN_PROJECT'
  | 'REVIEWEE_NOT_IN_PROJECT'
  | 'ALREADY_REVIEWED';

export interface ReviewValidation {
  canReview: boolean;
  reviewValidReason: ReviewValidReason;
}
