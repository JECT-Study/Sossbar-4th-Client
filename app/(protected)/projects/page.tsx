import { dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { fetchProjects } from '@/features/project/api/fetchers';
import { projectKeys } from '@/features/project/api/query-keys';
import { ProjectsStream } from '@/features/project/components/projects-stream';
import { getQueryClient } from '@/shared/lib/get-query-client';

const ProjectsPageFallback = () => (
  <div className="flex min-h-[240px] items-center justify-center">
    <p className="text-body-base text-text-subtle">화면을 불러오는 중…</p>
  </div>
);

const ProjectsPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: projectKeys.list(), queryFn: fetchProjects }),
    queryClient.prefetchQuery({ queryKey: profileKeys.my, queryFn: fetchMyProfile }),
  ]);

  return (
    <Suspense fallback={<ProjectsPageFallback />}>
      <ProjectsStream state={dehydrate(queryClient)} />
    </Suspense>
  );
};

export default ProjectsPage;
