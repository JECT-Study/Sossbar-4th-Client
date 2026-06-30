import type { Tag } from '@/features/tag';

import type { Spectrum, SpectrumWithValue } from './spectrum';

export type UserPosition = 'FRONTEND' | 'BACKEND' | 'PM' | 'PD' | 'AI' | 'QA' | 'ETC';

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

export interface ReviewFormData {
  tags: Tag[];
  spectrums: Spectrum[];
}

export interface CreateReviewRequest {
  projectId: number;
  revieweeId: number;
  feedback: string;
  projectPosition: UserPosition;
  projectDetailPosition?: string;
  tagIds: number[];
  spectrums: SpectrumWithValue[];
}

export interface CreateReviewReviewReqDto {
  projectId: number;
  revieweeId: number;
  feedback: string;
  projectPosition: UserPosition;
  projectDetailPosition?: string;
  tagIds: number[];
}

export interface CreateReviewSpectrumReqDto {
  spectrumAxisId: number;
  spectrumStrength: number;
}

/** POST /api/v1/reviews 요청 본문 (백엔드 ReviewCreateReqDto) */
export interface CreateReviewApiBody {
  reviewReqDto: CreateReviewReviewReqDto;
  spectrumReqDtos: CreateReviewSpectrumReqDto[];
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
