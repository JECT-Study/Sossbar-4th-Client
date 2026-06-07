import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProjectPageClientWrapper } from './project-page-client-wrapper';
import { fetchProject } from '../api/fetchers';
import { projectKeys } from '../api/query-keys';

type Props = {
  userId: number;
  projectId: number;
};

export const ProjectDetailStream = async ({ userId, projectId }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectPageClientWrapper userId={userId} projectId={projectId} />
    </HydrationBoundary>
  );
};
