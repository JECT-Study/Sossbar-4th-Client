'use client';

import { use } from 'react';

import { ProfilePageContent } from '@/features/profile';
import { useSessionUser } from '@/shared/lib/session-user';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { userId } = use(params);
  const profileUserId = Number(userId);
  const sessionUser = useSessionUser();
  const isMyProfile = profileUserId === sessionUser?.userId;

  return <ProfilePageContent userId={profileUserId} isMyProfile={isMyProfile} />;
};

export default ProfilePage;
