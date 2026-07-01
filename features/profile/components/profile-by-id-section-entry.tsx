import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { profileKeys } from '@/features/profile/profile.query-keys';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { fetchProfileById } from '../profile.api';
import { ProfileByIdSectionGate } from './profile-by-id-section-gate';

interface Props {
  userId: number;
  isMyProfile?: boolean;
}

export const ProfileByIdSectionEntry = async ({ userId, isMyProfile }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchProfileById(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileByIdSectionGate userId={userId} isMyProfile={isMyProfile} />
    </HydrationBoundary>
  );
};
