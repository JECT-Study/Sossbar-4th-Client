import type { Spectrum, SpectrumWithValue } from './spectrum';
import type { Tag } from './tag';

export type Review = {
  reviewId: number;
  projectName: string;
  host: string;
  projectImage: string | null;
  reviewedAt: string;
  positiveFeedback: string;
  negativeFeedback?: string; // 본인 후기 조회 시에만 포함. 타인 조회 시 응답에서 제외.
  reviewerNickname: string;
};

export type ReviewFormData = {
  tags: Tag[];
  spectrums: Spectrum[];
};

export type CreateReviewRequest = {
  projectId: number;
  revieweeId: number;
  praise: string;
  improvement: string;
  tagIds: number[];
  spectrums: SpectrumWithValue[];
};

/** POST /api/v1/reviews 요청 본문 (백엔드 ReviewCreateReqDto) */
export type CreateReviewApiBody = {
  reviewReqDto: {
    projectId: number;
    revieweeId: number;
    positiveFeedback: string;
    negativeFeedback?: string;
    tagIds: number[];
  };
  spectrumReqDtos: {
    spectrumAxisId: number;
    spectrumStrength: number;
  }[];
};
