import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProjectSection } from './project-section';
import { fetchUserProjects, projectKeys } from '../project.api';

interface Props {
  userId: number;
  userLink: string;
}

export const ProjectSectionStream = async ({ userId, userLink }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: projectKeys.byUser(userId),
    queryFn: () => fetchUserProjects(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectSection userId={userId} userLink={userLink} />
    </HydrationBoundary>
  );
};
