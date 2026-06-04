import type { Tag } from '@/features/tag';

import type { ReviewFormData } from '../types/review';
import type { Spectrum } from '../types/spectrum';

/** GET /api/v1/form-data — 백엔드 FormDataResDto */
type FormDataTagApi = {
  tagId: number;
  tagName: string;
};

type FormDataSpectrumAxisApi = {
  spectrumAxisId: number;
  leftLabel: string;
  rightLabel: string;
};

export type ReviewFormDataApiResponse = {
  tags: FormDataTagApi[];
  spectrumAxes: FormDataSpectrumAxisApi[];
};

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
