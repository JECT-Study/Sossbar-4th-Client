import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProjectSectionGate } from './project-section-gate';
import { fetchUserProjects, projectKeys } from '../project.api';

interface Props {
  userLink: string;
}

export const ProjectSectionStream = async ({ userLink }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: projectKeys.byUser(userLink),
    queryFn: () => fetchUserProjects(userLink),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectSectionGate userLink={userLink} />
    </HydrationBoundary>
  );
};
