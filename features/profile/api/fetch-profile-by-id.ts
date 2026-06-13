import { apiRequest } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type { Profile } from '../profile.types';

export const fetchProfileById = (userId: number, init?: ApiRequestOptions): Promise<Profile> =>
  apiRequest<Profile>(`/users/profile/${userId}`, init);
