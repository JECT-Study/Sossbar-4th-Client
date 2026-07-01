import { redirect } from 'next/navigation';

import { parseProjectInviteId, PROJECT_INVITE_QUERY_KEY } from '@/features/project';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sossbar - 프로젝트 초대',
  description: '프로젝트 팀에 참여하고 동료와 후기를 나눠 보세요',
};

type ProjectInvitePageProps = {
  searchParams: Promise<{ projectId?: string }>;
};

const ProjectInviteRedirectPage = async ({ searchParams }: ProjectInvitePageProps) => {
  const { projectId: rawProjectId } = await searchParams;
  const projectId = parseProjectInviteId(rawProjectId ?? null);

  if (projectId != null) {
    redirect(`/projects?${PROJECT_INVITE_QUERY_KEY}=${projectId}`);
  }

  redirect('/projects');
};

export default ProjectInviteRedirectPage;
