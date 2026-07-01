import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { SpectrumCardGate } from './spectrum-card-gate';
import { fetchSpectrum, fetchSpectrumByProject, spectrumKeys } from '../spectrum.api';

interface Props {
  userLink: string;
  projectId?: number;
  showDistribution?: boolean;
}

export const SpectrumCardEntry = async ({ userLink, projectId, showDistribution }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: spectrumKeys.detail(userLink, projectId),
    queryFn: () => (projectId === undefined ? fetchSpectrum(userLink) : fetchSpectrumByProject(userLink, projectId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpectrumCardGate userLink={userLink} projectId={projectId} showDistribution={showDistribution} />
    </HydrationBoundary>
  );
};
