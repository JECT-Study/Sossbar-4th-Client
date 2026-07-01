'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchSpectrum, fetchSpectrumByProject } from './soft-skills.api';
import { softSkillsKeys } from './soft-skills.query-keys';

interface UseSpectrumParams {
  userId: number;
  projectId?: number;
}

export const useSpectrum = ({ userId, projectId }: UseSpectrumParams) =>
  useSuspenseQuery({
    queryKey: softSkillsKeys.spectrum(userId, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userId) : fetchSpectrumByProject(userId, projectId)),
  });
