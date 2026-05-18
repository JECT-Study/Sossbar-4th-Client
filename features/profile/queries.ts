import { useQuery } from '@tanstack/react-query';

import { fetchProfile } from './fetchers';
import { profileKeys } from './query-keys';

export const useProfile = () =>
  useQuery({
    queryKey: profileKeys.detail(),
    queryFn: fetchProfile,
  });
