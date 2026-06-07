import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile.api';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProjectsPageContent } from './projects-page-content';
import { fetchProjects } from '../api/fetchers';
import { projectKeys } from '../api/query-keys';

export const ProjectsStream = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: projectKeys.list(), queryFn: fetchProjects }),
    queryClient.prefetchQuery({ queryKey: profileKeys.my, queryFn: fetchMyProfile }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsPageContent />
    </HydrationBoundary>
  );
};
