import { apiRequest } from '@/shared/lib/api';

import type { SignupPayload, SignupResponse } from './types';

export const createSignup = ({ name, bio }: SignupPayload): Promise<SignupResponse> => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('bio', bio);

  return apiRequest<SignupResponse>('/users/onboarding', {
    method: 'POST',
    body: formData,
  });
};
