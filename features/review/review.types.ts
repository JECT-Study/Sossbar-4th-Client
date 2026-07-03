import type { Tag } from '@/features/tag';

import type { ReviewWriteFormSchema } from './review.schemas';
import type { z } from 'zod';

/** 후기 조회 시 표시되는 직군. 과거 데이터 표시용으로만 사용한다(후기 작성 요청에는 포함하지 않음). */
export type UserPosition = 'FE' | 'BE' | 'PM' | 'PD';

export interface Review {
  reviewId: number;
  projectName: string;
  host: string;
  projectImage: string | null;
  createdAt: string;
  feedback: string;
  reviewerNickname: string;
  /** 프로필 예시 등 더미/목 데이터용 후기 작성자 아바타 */
  reviewerImageUrl?: string | null;
  projectPosition?: UserPosition;
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
  tagIds: number[];
  spectrums: SpectrumWithValue[];
}

export type ReviewWriteFormData = z.infer<typeof ReviewWriteFormSchema>;

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
