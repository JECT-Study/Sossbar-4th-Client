import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { fetchMyProfile } from '@/features/mypage/apis/fetch-my-profile.api';
import { fetchProfileById } from '@/features/profile/api/fetch-profile-by-id';
import { buildProfileShareMetadata } from '@/features/profile/lib/build-profile-share-metadata';
import { profileKeys } from '@/features/profile/query-keys';
import { PageContainer } from '@/shared/components/page-container';
import { getQueryClient } from '@/shared/lib/get-query-client';
import { parsePositiveInt } from '@/shared/lib/parse-positive-int';

import type { Metadata } from 'next';

import { ProfileDetailView } from './_components/profile-detail-view';

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

  return buildProfileShareMetadata(profileUserId);
};

const Page = async ({ params }: ProfilePageProps) => {
  const { userId } = await params;
  const profileUserId = parsePositiveInt(userId);

  if (profileUserId === null) {
    return notFound();
  }

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.detail(profileUserId),
      queryFn: () => fetchProfileById(profileUserId),
    }),
    queryClient.prefetchQuery({
      queryKey: profileKeys.my,
      queryFn: () => fetchMyProfile(),
    }),
  ]);

  return (
    <PageContainer className="mb-20">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfileDetailView userId={profileUserId} />
      </HydrationBoundary>
    </PageContainer>
  );
};

export default Page;
