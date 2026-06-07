'use client';

import { use } from 'react';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { ProjectPageContent } from '@/features/project';

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
  const { data: profile } = useMyProfile();
  const isMyProfile = profileUserId === profile?.userId;

  return <ProjectPageContent userId={profileUserId} projectId={projectIdNum} isMyProfile={isMyProfile} />;
};

export default ProjectPage;
