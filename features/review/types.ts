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

export type ReceivedTagCount = {
  tagId: number;
  tagName: string;
  count: number;
};

export type ReceivedTags = {
  top3Tags: ReceivedTagCount[];
  allTags: ReceivedTagCount[];
};

export type SpectrumInfo = {
  spectrumAxisId: number;
  axisName: string;
  averageStrength: number;
  totalCount: number;
  leftStrengthCount: number;
  rightStrengthCount: number;
};

export type SpectrumStats = {
  spectrumInfoResDtos: SpectrumInfo[];
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
  praise: string;
  improvement: string;
  tagIds: number[];
  spectrums: SpectrumWithValue[];
};
