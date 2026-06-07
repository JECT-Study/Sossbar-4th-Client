'use client';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';

import { ProjectPageContent } from './project-page-content';

type Props = {
  userId: number;
  projectId: number;
};

export const ProjectPageClientWrapper = ({ userId, projectId }: Props) => {
  const { data: profile } = useMyProfile();
  const isMyProfile = userId === profile?.userId;

  return <ProjectPageContent userId={userId} projectId={projectId} isMyProfile={isMyProfile} />;
};
