import { apiRequest } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type { Profile } from '../profile.types';

export const fetchMyProfile = (init?: ApiRequestOptions): Promise<Profile> => apiRequest('/users/profile', init);
