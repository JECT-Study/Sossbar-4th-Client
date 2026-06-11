import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import type { Profile } from '@/features/profile/profile.types';
import { ProjectPageContent } from '@/features/project';
import { fetchProject } from '@/features/project/api/fetchers';
import { projectKeys } from '@/features/project/api/query-keys';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

type ProjectPageProps = {
  params: Promise<{
    userId: string;
    projectId: string;
  }>;
};

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { userId, projectId } = await params;
  const profileUserId = parsePositiveInt(userId);
  const projectIdNum = parsePositiveInt(projectId);

  if (profileUserId === null || projectIdNum === null) {
    return notFound();
  }

  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  try {
    await queryClient.fetchQuery({
      queryKey: projectKeys.detail(projectIdNum),
      queryFn: () => fetchProject(projectIdNum, { headers: { Cookie: cookieStore.toString() } }),
    });
  } catch {
    return notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfile({ headers: { Cookie: cookieStore.toString() } }),
  });

  const profile = queryClient.getQueryData<Profile>(profileKeys.my) ?? null;
  const isMyProfile = profileUserId === profile?.userId;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectPageContent userId={profileUserId} projectId={projectIdNum} isMyProfile={isMyProfile} />
    </HydrationBoundary>
  );
};

export default ProjectPage;
