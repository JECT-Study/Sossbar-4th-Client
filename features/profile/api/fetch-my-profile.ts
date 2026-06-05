import { apiRequest } from '@/shared/lib/api';

import type { Profile } from '../profile.types';

export const fetchMyProfile = (): Promise<Profile> => apiRequest('/users/profile');
