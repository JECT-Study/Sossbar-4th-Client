import { redirect } from 'next/navigation';

import { parseProjectInviteLink, PROJECT_INVITE_QUERY_KEY } from '@/features/project';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sossbar - 프로젝트 초대',
  description: '프로젝트 팀에 참여하고 동료와 후기를 나눠 보세요',
};

type ProjectInvitePageProps = {
  searchParams: Promise<{ projectLink?: string }>;
};

const ProjectInviteRedirectPage = async ({ searchParams }: ProjectInvitePageProps) => {
  const { projectLink: rawProjectLink } = await searchParams;
  const projectLink = parseProjectInviteLink(rawProjectLink ?? null);

  if (projectLink != null) {
    redirect(`/projects?${PROJECT_INVITE_QUERY_KEY}=${encodeURIComponent(projectLink)}`);
  }

  redirect('/projects');
};

export default ProjectInviteRedirectPage;
