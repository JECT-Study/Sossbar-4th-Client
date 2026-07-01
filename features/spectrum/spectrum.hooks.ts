'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchSpectrum, fetchSpectrumByProject } from './spectrum.api';
import { spectrumKeys } from './spectrum.query-keys';

interface UseSpectrumParams {
  userLink: string;
  projectId?: number;
}

export const useSpectrum = ({ userLink, projectId }: UseSpectrumParams) =>
  useSuspenseQuery({
    queryKey: spectrumKeys.detail(userLink, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userLink) : fetchSpectrumByProject(userLink, projectId)),
  });
