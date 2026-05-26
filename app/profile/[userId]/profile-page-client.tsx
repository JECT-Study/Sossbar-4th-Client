'use client';

import { use } from 'react';

import { ProfilePageContent } from '@/features/profile';
import { useSessionUser } from '@/shared/lib/session-user';

type ProfilePageClientProps = {
  params: Promise<{
    userId: string;
  }>;
};

export const ProfilePageClient = ({ params }: ProfilePageClientProps) => {
  const { userId } = use(params);
  const parsedUserId = Number(userId);
  const profileUserId = Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : 1;
  const sessionUser = useSessionUser();
  const isMockDev = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW !== 'false';
  const mockMyProfileUserId = 1;
  const isMyProfile = (isMockDev && profileUserId === mockMyProfileUserId) || profileUserId === sessionUser?.userId;

  return <ProfilePageContent userId={profileUserId} isMyProfile={isMyProfile} />;
};
