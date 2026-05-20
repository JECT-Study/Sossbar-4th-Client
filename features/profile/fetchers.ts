import { apiRequest } from '@/shared/lib/api';

import type { Profile, UpdateProfilePayload } from './types';

export const fetchProfile = (): Promise<Profile> => apiRequest<Profile>('/users/profile');

export const updateProfile = (payload: UpdateProfilePayload): Promise<{ userId: number }> =>
  apiRequest<{ userId: number }>('/users/profile', { method: 'PATCH', body: payload });
