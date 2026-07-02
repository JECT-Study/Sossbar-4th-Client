import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { fetchMyProfileOptional, profileKeys } from '@/features/profile';
import { fetchProject, ProjectDetailPageContent, ProjectDetailPageSkeleton, projectKeys } from '@/features/project';
import { getQueryClient } from '@/shared/lib/get-query-client';

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);

  if (!Number.isFinite(projectId) || projectId <= 0) {
    notFound();
  }

  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  if (cookieStore.has('accessToken')) {
    try {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: projectKeys.detail(projectId),
          queryFn: () => fetchProject(projectId),
        }),
        queryClient.prefetchQuery({
          queryKey: profileKeys.my,
          queryFn: () => fetchMyProfileOptional({ headers: { Cookie: cookieStore.toString() } }),
        }),
      ]);
    } catch {
      // prefetch 실패는 클라이언트에서 재시도
    }
  }

  return (
    <Suspense fallback={<ProjectDetailPageSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectDetailPageContent projectId={projectId} />
      </HydrationBoundary>
    </Suspense>
  );
};

export default ProjectDetailPage;
