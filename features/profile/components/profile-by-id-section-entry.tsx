import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { profileKeys } from '@/features/profile/profile.query-keys';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { fetchProfileById } from '../profile.api';
import { ProfileByIdSectionGate } from './profile-by-id-section-gate';

interface Props {
  userLink: string;
  isMyProfile?: boolean;
}

export const ProfileByIdSectionEntry = async ({ userLink, isMyProfile }: Props) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.detail(userLink),
    queryFn: () => fetchProfileById(userLink),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileByIdSectionGate userLink={userLink} isMyProfile={isMyProfile} />
    </HydrationBoundary>
  );
};
