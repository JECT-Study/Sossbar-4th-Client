import { useQuery } from '@tanstack/react-query';

import { getAuthToken } from '@/shared/lib/auth-token';

import { fetchMyProfile } from '../api/fetch-my-profile';
import { profileKeys } from '../query-keys';

export const useMyProfile = () => {
  const hasAuthToken = getAuthToken() !== null;

  return useQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfile(),
    enabled: hasAuthToken,
    throwOnError: false,
  });
};
