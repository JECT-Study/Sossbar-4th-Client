import { dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { buildReviewRequestDescription } from '@/features/profile/lib/profile-share-content';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { fetchProjects } from '@/features/project/api/fetchers';
import { projectKeys } from '@/features/project/api/query-keys';
import { ProjectsStream } from '@/features/project/components/projects-stream';
import { parseProjectInviteId } from '@/features/project/lib/parse-project-invite-id';
import { PROJECT_INVITE_QUERY_KEY } from '@/features/project/lib/project-invite-query';
import { SHARE_INVITER_NAME_PARAM } from '@/shared/constants/share-query';
import { buildShareOgMetadata } from '@/shared/lib/build-share-metadata';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parseShareDisplayName } from '@/shared/lib/parse-share-display-name';

import type { Metadata } from 'next';

type ProjectsPageMetadataProps = {
  searchParams: Promise<{
    [PROJECT_INVITE_QUERY_KEY]?: string;
    [SHARE_INVITER_NAME_PARAM]?: string;
  }>;
};

export const generateMetadata = async ({ searchParams }: ProjectsPageMetadataProps): Promise<Metadata> => {
  const params = await searchParams;
  const projectId = parseProjectInviteId(params[PROJECT_INVITE_QUERY_KEY]);

  if (projectId === null) {
    return { title: '프로젝트' };
  }

  const inviterName = parseShareDisplayName(params[SHARE_INVITER_NAME_PARAM]) ?? '';
  const description = buildReviewRequestDescription(inviterName);
  const pathSearchParams = new URLSearchParams({
    [PROJECT_INVITE_QUERY_KEY]: String(projectId),
  });

  if (inviterName) {
    pathSearchParams.set(SHARE_INVITER_NAME_PARAM, inviterName);
  }

  return buildShareOgMetadata({
    description,
    path: `/projects?${pathSearchParams.toString()}`,
  });
};

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
