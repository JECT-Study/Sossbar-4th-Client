import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchProfile } from '../apis/fetch-profile.api';

export const useProfile = () => {
  return useSuspenseQuery({
    queryKey: ['mypage'],
    queryFn: () => fetchProfile(),
  });
};
