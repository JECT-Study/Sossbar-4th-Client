import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ProfileSectionStream } from '@/features/profile';
import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { fetchProfileById } from '@/features/profile/api/fetch-profile-by-id';
import { ProfileSectionSkeleton } from '@/features/profile/components/profile-section-skeleton';
import { buildProfileShareMetadata } from '@/features/profile/lib/build-profile-share-metadata';
import { PageContainer } from '@/shared/components/page-container';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

import type { Metadata } from 'next';

import { ProfileDetailStreams } from '../_components/profile-detail-streams';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export const generateMetadata = async ({ params }: ProfilePageProps): Promise<Metadata> => {
  const { userId } = await params;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return { title: '프로필' };
  }

  try {
    const cookieStore = await cookies();
    const profile = await fetchProfileById(profileUserId, { headers: { Cookie: cookieStore.toString() } });
    return buildProfileShareMetadata(profileUserId, profile.username);
  } catch {
    return buildProfileShareMetadata(profileUserId);
  }
};

const Page = async ({ params }: ProfilePageProps) => {
  const { userId } = await params;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return notFound();
  }

  const cookieStore = await cookies();
  const myProfile = await fetchMyProfile({ headers: { Cookie: cookieStore.toString() } }).catch(() => null);
  const isMyProfile = myProfile?.userId === profileUserId;

  return (
    <PageContainer className="mb-20">
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <ProfileSectionStream userId={profileUserId} isMyProfile={isMyProfile} />
      </Suspense>
      <ProfileDetailStreams userId={profileUserId} />
    </PageContainer>
  );
};

export default Page;
