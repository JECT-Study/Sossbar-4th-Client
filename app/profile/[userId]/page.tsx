import { buildProfileShareMetadata } from '@/features/profile/lib/build-profile-share-metadata';

import type { Metadata } from 'next';

import { ProfilePageClient } from './profile-page-client';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export const generateMetadata = async ({ params }: ProfilePageProps): Promise<Metadata> => {
  const { userId } = await params;
  const profileUserId = Number(userId);

  if (!Number.isFinite(profileUserId) || profileUserId <= 0) {
    return { title: '프로필' };
  }

  return buildProfileShareMetadata(profileUserId);
};

const ProfilePage = ({ params }: ProfilePageProps) => <ProfilePageClient params={params} />;

export default ProfilePage;
