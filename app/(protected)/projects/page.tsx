import { dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { fetchMyProfileOptional } from '@/features/profile/api/fetch-my-profile-optional';
import { buildReviewRequestDescription } from '@/features/profile/lib/profile-share-content';
import { profileKeys } from '@/features/profile/profile.query-keys';
import {
  fetchProjects,
  parseProjectInviteId,
  PROJECT_INVITE_QUERY_KEY,
  projectKeys,
  ProjectsStream,
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
  const projectId = parseProjectInviteId(params[PROJECT_INVITE_QUERY_KEY] ?? null);

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
  const cookieStore = await cookies();

  if (cookieStore.has('accessToken')) {
    try {
      await Promise.all([
        queryClient.prefetchQuery({ queryKey: projectKeys.list(), queryFn: fetchProjects }),
        queryClient.prefetchQuery({
          queryKey: profileKeys.my,
          queryFn: () => fetchMyProfileOptional({ headers: { Cookie: cookieStore.toString() } }),
        }),
      ]);
    } catch {
      // 비로그인·만료 세션 등 prefetch 실패 시에도 초대 링크 랜딩은 허용
    }
  }

  return (
    <Suspense fallback={<ProjectsPageFallback />}>
      <ProjectsStream state={dehydrate(queryClient)} />
    </Suspense>
  );
};

export default ProjectsPage;
