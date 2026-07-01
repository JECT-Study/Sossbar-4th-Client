import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ProfileSectionBoundary } from '@/features/profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { fetchProfileById } from '../profile.api';

interface Props {
  userId: number;
  isMyProfile?: boolean;
}

export const ProfileSectionStream = async ({ userId, isMyProfile }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchProfileById(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileSectionBoundary userId={userId} isMyProfile={isMyProfile} />
    </HydrationBoundary>
  );
};
