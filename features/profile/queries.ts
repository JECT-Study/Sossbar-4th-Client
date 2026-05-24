import { useQuery } from '@tanstack/react-query';

import { fetchProfile } from './fetchers';
import { profileKeys } from './query-keys';

export const useProfile = (userId: number) =>
  useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchProfile(userId),
    enabled: Number.isFinite(userId) && userId > 0,
    throwOnError: false,
  });
