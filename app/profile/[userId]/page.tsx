'use client';

import { use } from 'react';

import { ProfilePageContent } from '@/features/profile';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { userId } = use(params);

  return <ProfilePageContent userId={userId} isMyProfile={true} />;
};

export default ProfilePage;
