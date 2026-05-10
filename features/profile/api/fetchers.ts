import { apiRequest } from '@/shared/lib/api';

import type { OnboardingRequest, Profile, UpdateProfileRequest } from '../types/profile';

export const createOnboarding = (data: OnboardingRequest): Promise<{ userId: number }> =>
  apiRequest<{ userId: number }>('/users/onboarding', { method: 'POST', body: data });

export const fetchProfile = (): Promise<Profile> => apiRequest<Profile>('/users/profile');

export const updateProfile = (data: UpdateProfileRequest): Promise<{ userId: number }> =>
  apiRequest<{ userId: number }>('/users/profile', { method: 'PATCH', body: data });
