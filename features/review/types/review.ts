export type Tag = {
  tagId: number;
  name: string;
};

export type Spectrum = {
  spectrumId: number;
  leftLabel: string;
  rightLabel: string;
};

export type SpectrumWithValue = {
  spectrumId: number;
  value: number;
};

export type SpectrumWithAverage = Spectrum & {
  averageValue: number;
};

export type Review = {
  reviewId: number;
  projectId: number;
  authorNickname: string;
  praise: string;
  improvement: string;
  tags: Tag[];
  spectrums: SpectrumWithValue[];
  createdAt: string;
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
