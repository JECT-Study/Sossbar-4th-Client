import { apiRequest, assertApiData } from '@/shared/lib/api';

import type { Profile, UpdateProfileRequest } from '../types/profile';

export const fetchProfile = (): Promise<Profile> => apiRequest<Profile>('/users/profile').then(assertApiData);

export const updateProfile = (data: UpdateProfileRequest): Promise<{ userId: number }> =>
  apiRequest<{ userId: number }>('/users/profile', { method: 'PATCH', body: data }).then(assertApiData);
