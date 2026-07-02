import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { buildReviewRequestDescription, fetchMyProfileOptional, profileKeys } from '@/features/profile';
import {
  DEFAULT_PROJECT_LIST_PARAMS,
  fetchProjects,
  parseProjectInviteLink,
  PROJECT_INVITE_QUERY_KEY,
  projectKeys,
  ProjectsPageContent,
} from '@/features/project';
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
  const projectLink = parseProjectInviteLink(params[PROJECT_INVITE_QUERY_KEY] ?? null);

  if (projectLink === null) {
    return { title: '프로젝트' };
  }

  const inviterName = parseShareDisplayName(params[SHARE_INVITER_NAME_PARAM]) ?? '';
  const description = buildReviewRequestDescription(inviterName);
  const pathSearchParams = new URLSearchParams({
    [PROJECT_INVITE_QUERY_KEY]: projectLink,
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
  const cookieStore = await cookies();

  if (cookieStore.has('accessToken')) {
    const cookieHeader = cookieStore.toString();

    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: projectKeys.list(DEFAULT_PROJECT_LIST_PARAMS),
        queryFn: () => fetchProjects(DEFAULT_PROJECT_LIST_PARAMS, { headers: { Cookie: cookieHeader } }),
      }),
      queryClient.prefetchQuery({
        queryKey: profileKeys.my,
        queryFn: () => fetchMyProfileOptional({ headers: { Cookie: cookieHeader } }),
      }),
    ]);
  }

  return (
    <Suspense fallback={<ProjectsPageFallback />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectsPageContent />
      </HydrationBoundary>
    </Suspense>
  );
};

export default ProjectsPage;
