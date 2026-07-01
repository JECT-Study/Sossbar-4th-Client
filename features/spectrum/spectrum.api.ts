import { apiRequest } from '@/shared/lib/api';

import type { SpectrumInfo } from './spectrum.types';

export const spectrumKeys = {
  all: ['spectrum'] as const,
  detail: (userLink: string, projectId?: number) => [...spectrumKeys.all, userLink, projectId] as const,
};

/** GET /api/v1/reviews/spectrums/{userLink} 받은 스펙트럼 전체 조회 */
export const fetchSpectrum = (userLink: string): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userLink}`);

/** GET /api/v1/reviews/spectrums/{userLink}/{projectId} 받은 스펙트럼 프로젝트별 조회 */
export const fetchSpectrumByProject = (userLink: string, projectId: number): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userLink}/${projectId}`);
