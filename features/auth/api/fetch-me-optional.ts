import { ApiError } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type { UserInfoResDto } from '../types';

import { getMyProfile } from '../fetchers';

const UNAUTHENTICATED_STATUSES = new Set([401, 403]);

export const fetchMeOptional = async (init?: ApiRequestOptions): Promise<UserInfoResDto | null> => {
  try {
    return await getMyProfile(init);
  } catch (error) {
    if (error instanceof ApiError && UNAUTHENTICATED_STATUSES.has(error.status)) {
      return null;
    }
    throw error;
  }
};
