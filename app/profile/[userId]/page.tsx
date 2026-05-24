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
  const parsedUserId = Number(userId);
  const profileUserId = Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : 1;
  const sessionUser = useSessionUser();
  const isMockDevMyProfile = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW !== 'false';
  const isMyProfile = isMockDevMyProfile || profileUserId === sessionUser?.userId;

  return <ProfilePageContent userId={profileUserId} isMyProfile={isMyProfile} />;
};

export default ProfilePage;
