'use client';

import { use } from 'react';

import { ProjectPageContent } from '@/features/project';
import { useSessionUser } from '@/shared/lib/session-user';

type ProjectPageProps = {
  params: Promise<{
    userId: string;
    projectId: string;
  }>;
};

const ProjectPage = ({ params }: ProjectPageProps) => {
  const { userId, projectId } = use(params);
  const profileUserId = Number(userId);
  const projectIdNum = Number(projectId);
  const sessionUser = useSessionUser();
  const isMyProfile = profileUserId === sessionUser?.userId;

  return <ProjectPageContent projectId={projectIdNum} isMyProfile={isMyProfile} />;
};

export default ProjectPage;
