import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProjectSection } from './project-section';
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
      <ProjectSection userLink={userLink} />
    </HydrationBoundary>
  );
};
