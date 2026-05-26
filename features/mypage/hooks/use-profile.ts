import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchMyProfile } from '../apis/fetch-my-profile.api';

export const useProfile = () => {
  return useSuspenseQuery({
    queryKey: ['mypage'],
    queryFn: () => fetchMyProfile(),
  });
};
