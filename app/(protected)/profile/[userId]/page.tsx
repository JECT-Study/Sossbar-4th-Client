import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ProfileSectionStream } from '@/features/profile';
import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { fetchProfileById } from '@/features/profile/api/fetch-profile-by-id';
import { ProfileSectionSkeleton } from '@/features/profile/components/profile-section-skeleton';
import { buildProfileShareMetadata } from '@/features/profile/lib/build-profile-share-metadata';
import { PageContainer } from '@/shared/components/page-container';
import { SHARE_USER_NAME_PARAM } from '@/shared/constants/share-query';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';
import { parseShareDisplayName } from '@/shared/lib/parse-share-display-name';

import type { Metadata } from 'next';

import { ProfileDetailStreams } from '../_components/profile-detail-streams';

type ProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
  searchParams: Promise<{
    [SHARE_USER_NAME_PARAM]?: string;
  }>;
};

const resolveProfileShareUserName = async (
  profileUserId: number,
  queryUserName?: string,
): Promise<string | undefined> => {
  const fromQuery = parseShareDisplayName(queryUserName);
  if (fromQuery) {
    return fromQuery;
  }

  try {
    const profile = await fetchProfileById(profileUserId);
    return profile.username;
  } catch {
    return undefined;
  }
};

export const generateMetadata = async ({ params, searchParams }: ProfilePageProps): Promise<Metadata> => {
  const { userId } = await params;
  const { [SHARE_USER_NAME_PARAM]: rawUserName } = await searchParams;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return { title: '프로필' };
  }

  const userName = await resolveProfileShareUserName(profileUserId, rawUserName);
  const queryUserName = parseShareDisplayName(rawUserName);
  const pathSearchParams = new URLSearchParams();

  if (queryUserName) {
    pathSearchParams.set(SHARE_USER_NAME_PARAM, queryUserName);
  }

  const profilePath =
    pathSearchParams.size > 0
      ? `/profile/${profileUserId}?${pathSearchParams.toString()}`
      : `/profile/${profileUserId}`;

  return buildProfileShareMetadata(profileUserId, userName, profilePath);
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
