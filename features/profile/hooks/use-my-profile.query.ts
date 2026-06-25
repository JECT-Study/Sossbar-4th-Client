import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchMyProfileOptional } from '../api/fetch-my-profile-optional';
import { profileKeys } from '../profile.query-keys';

export const useMyProfile = () => {
  return useSuspenseQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfileOptional(),
  });
};
