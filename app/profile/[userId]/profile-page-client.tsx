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
  const profileUserId = Number(userId);
  const sessionUser = useSessionUser();
  const isMockDevMyProfile = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW !== 'false';
  const isMyProfile = isMockDevMyProfile || profileUserId === sessionUser?.userId;

  return <ProfilePageContent userId={profileUserId} isMyProfile={isMyProfile} />;
};
