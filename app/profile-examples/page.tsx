import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchProfileById } from '@/features/profile/api/fetch-profile-by-id';
import { profileKeys } from '@/features/profile/query-keys';
import { PageContainer } from '@/shared/components/page-container';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { ProfileDetailView } from '../profile/[userId]/_components/profile-detail-view';

const DEMO_PROFILE_USER_ID = 1;

const ProfileExamplesPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.detail(DEMO_PROFILE_USER_ID),
      queryFn: () => fetchProfileById(DEMO_PROFILE_USER_ID),
    }),
  ]);

  return (
    <PageContainer className="mb-20">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfileDetailView userId={DEMO_PROFILE_USER_ID} />
      </HydrationBoundary>
    </PageContainer>
  );
};

export default ProfileExamplesPage;
