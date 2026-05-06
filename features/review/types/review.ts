export type Tag = {
  tagId: number;
  name: string;
};

export type SpectrumWithAverage = {
  spectrumId: number;
  leftLabel: string;
  rightLabel: string;
  averageValue: number;
};

export type Review = {
  reviewId: number;
  projectId: number;
  authorNickname: string;
  praise: string;
  improvement: string;
  tags: Tag[];
  spectrums: Array<{ spectrumId: number; value: number }>;
  createdAt: string;
};

export type ReviewFormData = {
  tags: Tag[];
  spectrums: Array<{
    spectrumId: number;
    leftLabel: string;
    rightLabel: string;
  }>;
};

export type CreateReviewRequest = {
  projectId: number;
  praise: string;
  improvement: string;
  selectedTagIds: number[];
  spectrums: Array<{ spectrumId: number; value: number }>;
};
