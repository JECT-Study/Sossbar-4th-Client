import { dehydrate } from '@tanstack/react-query';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { fetchProject } from '@/features/project/api/fetchers';
import { projectKeys } from '@/features/project/api/query-keys';
import { ProjectDetailStream } from '@/features/project/components/project-detail-stream';
import { getQueryClient } from '@/shared/lib/get-query-client';

interface Props {
  params: Promise<{
    userId: string;
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { userId, projectId } = await params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: projectKeys.detail(Number(projectId)),
      queryFn: () => fetchProject(Number(projectId)),
    }),
    queryClient.prefetchQuery({ queryKey: profileKeys.my, queryFn: fetchMyProfile }),
  ]);

  return <ProjectDetailStream userId={Number(userId)} projectId={Number(projectId)} state={dehydrate(queryClient)} />;
};

export default ProjectPage;
