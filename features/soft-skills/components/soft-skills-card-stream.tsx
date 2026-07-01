import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { SoftSkillsCardBoundary } from './soft-skills-card-boundary';
import { fetchSpectrum, fetchSpectrumByProject } from '../soft-skills.api';
import { softSkillsKeys } from '../soft-skills.query-keys';

interface Props {
  userLink: string;
  projectId?: number;
  showDistribution?: boolean;
}

export const SoftSkillsCardStream = async ({ userLink, projectId, showDistribution }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: softSkillsKeys.spectrum(userLink, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userLink) : fetchSpectrumByProject(userLink, projectId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SoftSkillsCardBoundary userLink={userLink} projectId={projectId} showDistribution={showDistribution} />
    </HydrationBoundary>
  );
};
