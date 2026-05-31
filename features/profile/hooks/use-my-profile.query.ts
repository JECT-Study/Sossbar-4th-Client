import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchMyProfile } from '../api/fetch-my-profile';
import { profileKeys } from '../query-keys';

export const useMyProfile = () => {
  return useSuspenseQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfile(),
  });
};
