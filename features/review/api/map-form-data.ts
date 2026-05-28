import type { ReviewFormData } from '../types/review';
import type { Spectrum } from '../types/spectrum';
import type { Tag } from '../types/tag';

/** GET /api/v1/form-data — 백엔드 FormDataResDto */
type FormDataTagApi = {
  tagId: number;
  tagName?: string;
  name?: string;
};

type FormDataSpectrumAxisApi = {
  spectrumAxisId: number;
  spectrumAxisName?: string;
  axisName?: string;
  leftLabel: string;
  rightLabel: string;
};

/** MSW·레거시 클라이언트 형태 */
type FormDataSpectrumLegacyApi = {
  spectrumId: number;
  leftLabel: string;
  rightLabel: string;
};

export type ReviewFormDataApiResponse = {
  tags: FormDataTagApi[];
  spectrumAxes?: FormDataSpectrumAxisApi[];
  spectrums?: FormDataSpectrumLegacyApi[];
};

const mapTag = (tag: FormDataTagApi): Tag | null => {
  const name = (tag.name ?? tag.tagName ?? '').trim();
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

const mapSpectrumLegacy = (spectrum: FormDataSpectrumLegacyApi): Spectrum => ({
  spectrumId: spectrum.spectrumId,
  leftLabel: spectrum.leftLabel,
  rightLabel: spectrum.rightLabel,
});

/** BE FormDataResDto 및 MSW 레거시 응답을 ReviewFormData로 통일 */
export const mapReviewFormDataFromApi = (raw: ReviewFormDataApiResponse): ReviewFormData => {
  const tags = raw.tags.map(mapTag).filter((tag): tag is Tag => tag != null);

  const spectrums: Spectrum[] =
    raw.spectrumAxes != null && raw.spectrumAxes.length > 0
      ? raw.spectrumAxes.map(mapSpectrumAxis)
      : (raw.spectrums ?? []).map(mapSpectrumLegacy);

  return { tags, spectrums };
};
