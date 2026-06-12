import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { ProfileSectionStream } from '@/features/profile';
import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { ProfileSectionSkeleton } from '@/features/profile/components/profile-section-skeleton';
import { PageContainer } from '@/shared/components/page-container';

import { ProfileDetailStreams } from './_components/profile-detail-streams';

const Page = async () => {
  const cookieStore = await cookies();
  const myProfile = await fetchMyProfile({ headers: { Cookie: cookieStore.toString() } });

  return (
    <PageContainer className="mb-20">
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <ProfileSectionStream userId={myProfile.userId} isMyProfile />
      </Suspense>
      <ProfileDetailStreams userId={myProfile.userId} />
    </PageContainer>
  );
};

export default Page;
