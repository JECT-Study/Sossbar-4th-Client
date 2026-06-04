import { apiRequest } from '@/shared/lib/api';

import type { SpectrumInfo } from '../types/soft-skills.types';

export const fetchSpectrum = (userId: number): Promise<SpectrumInfo> =>
  apiRequest<SpectrumInfo>(`/reviews/spectrums/${userId}`);
