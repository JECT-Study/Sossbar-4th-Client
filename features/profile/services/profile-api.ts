import type { OnboardingRequest, Profile, UpdateProfileRequest } from '../types/profile';

const BASE = '/api/v1';

export const createOnboarding = async (data: OnboardingRequest): Promise<{ userId: number }> => {
  const res = await fetch(`${BASE}/users/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create onboarding');
  }
  return res.json() as Promise<{ userId: number }>;
};

export const fetchProfile = async (): Promise<Profile> => {
  const res = await fetch(`${BASE}/users/profile`);
  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }
  return res.json() as Promise<Profile>;
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<{ userId: number }> => {
  const res = await fetch(`${BASE}/users/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update profile');
  }
  return res.json() as Promise<{ userId: number }>;
};
