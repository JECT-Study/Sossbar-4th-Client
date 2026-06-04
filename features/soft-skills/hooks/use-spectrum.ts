import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchSpectrumByProject } from '../api/fetch-spectrum-by-project.api';
import { fetchSpectrum } from '../api/fetch-spectrum.api';
import { softSkillsKeys } from '../soft-skills.query-key';

interface Params {
  userId: number;
  projectId?: number;
}

export const useSpectrum = ({ userId, projectId }: Params) =>
  useSuspenseQuery({
    queryKey: softSkillsKeys.spectrum(userId, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userId) : fetchSpectrumByProject(userId, projectId)),
  });
