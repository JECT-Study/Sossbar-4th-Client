import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProjectsPageContent } from './projects-page-content';
import { fetchProjects } from '../api/fetchers';
import { projectKeys } from '../api/query-keys';

export const ProjectsStream = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsPageContent />
    </HydrationBoundary>
  );
};
