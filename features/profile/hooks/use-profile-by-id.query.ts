import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchProfileById } from '../api/fetch-profile-by-id';
import { profileKeys } from '../profile.query-keys';

export const useProfileById = (userId: number) =>
  useSuspenseQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchProfileById(userId),
  });
