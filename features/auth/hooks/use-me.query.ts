import { useSuspenseQuery } from '@tanstack/react-query';

import { authKeys } from '../api/auth.query-keys';
import { fetchMeOptional } from '../api/fetch-me-optional';

export const useMe = () => {
  return useSuspenseQuery({
    queryKey: authKeys.me,
    queryFn: () => fetchMeOptional(),
  });
};
