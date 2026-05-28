import { apiRequest } from '@/shared/lib/api';

import type { SignupPayload, SignupResponse } from './types';

const createSignupFormData = ({ name, bio }: SignupPayload) => {
  const formData = new FormData();

  formData.append('onboarding', new Blob([JSON.stringify({ username: name, bio })], { type: 'application/json' }));
  formData.append('profileImage', '');

  return formData;
};

export const createSignup = (payload: SignupPayload): Promise<SignupResponse> =>
  apiRequest<SignupResponse>('/users/onboarding', {
    method: 'POST',
    body: createSignupFormData(payload),
  });
