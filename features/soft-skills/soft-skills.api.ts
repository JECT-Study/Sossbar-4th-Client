import { apiRequest } from '@/shared/lib/api';

import type { SpectrumInfo } from './soft-skills.types';

export const fetchSpectrum = (userLink: string): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userLink}`);

export const fetchSpectrumByProject = (userLink: string, projectId: number): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userLink}/${projectId}`);
