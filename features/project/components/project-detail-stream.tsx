import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile.api';
import { profileKeys } from '@/features/profile/profile.query-keys';
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

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: projectKeys.detail(projectId), queryFn: () => fetchProject(projectId) }),
    queryClient.prefetchQuery({ queryKey: profileKeys.my, queryFn: fetchMyProfile }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectPageClientWrapper userId={userId} projectId={projectId} />
    </HydrationBoundary>
  );
};
