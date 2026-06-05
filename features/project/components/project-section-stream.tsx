import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProjectSection } from './project-section';
import { fetchUserProjects } from '../api/fetchers';
import { projectKeys } from '../api/query-keys';

export const ProjectSectionStream = async ({ userId }: { userId: number }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: projectKeys.byUser(userId),
    queryFn: () => fetchUserProjects(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectSection userId={userId} />
    </HydrationBoundary>
  );
};
