import { useQuery } from '@tanstack/react-query';

import { fetchMyProfile } from '../api/fetch-my-profile';
import { profileKeys } from '../profile.query-keys';

export const useMyProfile = () =>
  useQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfile(),
    throwOnError: false,
  });
