import { apiRequest } from '@/shared/lib/api';

import type { Profile } from '../profile.types';

export const fetchProfileById = (userId: number): Promise<Profile> => apiRequest<Profile>(`/users/profile/${userId}`);
