import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { SoftSkillsCardBoundary } from './soft-skills-card-boundary';
import { fetchSpectrumByProject } from '../api/fetch-spectrum-by-project.api';
import { fetchSpectrum } from '../api/fetch-spectrum.api';
import { softSkillsKeys } from '../soft-skills.query-key';

interface SoftSkillsCardStreamProps {
  userId: number;
  projectId?: number;
  showDistribution?: boolean;
}

export const SoftSkillsCardStream = async ({ userId, projectId, showDistribution }: SoftSkillsCardStreamProps) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: softSkillsKeys.spectrum(userId, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userId) : fetchSpectrumByProject(userId, projectId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SoftSkillsCardBoundary userId={userId} projectId={projectId} showDistribution={showDistribution} />
    </HydrationBoundary>
  );
};
