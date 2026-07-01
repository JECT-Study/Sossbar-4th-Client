'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchSpectrum, fetchSpectrumByProject } from './soft-skills.api';
import { softSkillsKeys } from './soft-skills.query-keys';

interface UseSpectrumParams {
  userLink: string;
  projectId?: number;
}

export const useSpectrum = ({ userLink, projectId }: UseSpectrumParams) =>
  useSuspenseQuery({
    queryKey: softSkillsKeys.spectrum(userLink, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userLink) : fetchSpectrumByProject(userLink, projectId)),
  });
