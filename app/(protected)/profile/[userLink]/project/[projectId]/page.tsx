import { dehydrate } from '@tanstack/react-query';

import { fetchMyProfile, fetchProfileById } from '@/features/profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { fetchProject, ProjectFeedbackStream, projectKeys } from '@/features/project';
import { getQueryClient } from '@/shared/lib/get-query-client';

interface Props {
  params: Promise<{
    userLink: string;
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { userLink, projectId } = await params;
  const queryClient = getQueryClient();

  const projectIdNum = Number(projectId);

  const [, , profile] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: projectKeys.detail(projectIdNum),
      queryFn: () => fetchProject(projectIdNum),
    }),
    queryClient.prefetchQuery({ queryKey: profileKeys.my, queryFn: fetchMyProfile }),
    queryClient.fetchQuery({
      queryKey: profileKeys.detail(userLink),
      queryFn: () => fetchProfileById(userLink),
    }),
  ]);

  return <ProjectFeedbackStream userLink={profile.userLink} projectId={projectIdNum} state={dehydrate(queryClient)} />;
};

export default ProjectPage;
