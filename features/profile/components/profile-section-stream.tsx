import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ProfileSectionBoundary } from '@/features/profile';
import { fetchProfileById } from '@/features/profile/api/fetch-profile-by-id';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { getQueryClient } from '@/shared/lib/get-query-client';

export const ProfileSectionStream = async ({ userId }: { userId: number }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchProfileById(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileSectionBoundary userId={userId} />
    </HydrationBoundary>
  );
};
