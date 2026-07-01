import { dehydrate } from '@tanstack/react-query';

import { fetchMyProfile, fetchProfileById } from '@/features/profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { fetchProject, ProjectDetailStream, projectKeys } from '@/features/project';
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

  const profileUserId = Number(userId);
  const projectIdNum = Number(projectId);

  const [, , profile] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: projectKeys.detail(projectIdNum),
      queryFn: () => fetchProject(projectIdNum),
    }),
    queryClient.prefetchQuery({ queryKey: profileKeys.my, queryFn: fetchMyProfile }),
    queryClient.fetchQuery({
      queryKey: profileKeys.detail(profileUserId),
      queryFn: () => fetchProfileById(profileUserId),
    }),
  ]);

  return (
    <ProjectDetailStream
      userId={profileUserId}
      userLink={profile.userLink}
      projectId={projectIdNum}
      state={dehydrate(queryClient)}
    />
  );
};

export default ProjectPage;
