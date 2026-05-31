import { useQuery } from '@tanstack/react-query';

import { fetchProfileById } from '../api/fetch-profile-by-id';
import { profileKeys } from '../query-keys';

export const useProfileById = (userId: number) =>
  useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => fetchProfileById(userId),
    enabled: Number.isFinite(userId) && userId > 0,
    throwOnError: false,
  });
