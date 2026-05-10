import { useQuery } from '@tanstack/react-query';

import { fetchProfile } from './fetchers';

/** 프로필 단일 리소스용 — `invalidateQueries({ queryKey: profileKeys.all })`로 전부 무효화 */
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

export const useProfile = () =>
  useQuery({
    queryKey: profileKeys.detail(),
    queryFn: fetchProfile,
  });
