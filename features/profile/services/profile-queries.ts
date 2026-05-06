import { useQuery } from '@tanstack/react-query';

import { fetchProfile } from './profile-api';

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

export const useProfile = () =>
  useQuery({
    queryKey: profileKeys.detail(),
    queryFn: fetchProfile,
  });
