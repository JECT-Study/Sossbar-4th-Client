import { apiRequest } from '@/shared/lib/api';

import type { SignupPayload, SignupResponse } from './types';

const createSignupFormData = ({ name, bio, requiredAgree, marketingAgree, profileImage }: SignupPayload) => {
  const formData = new FormData();

  formData.append(
    'onboarding',
    new Blob([JSON.stringify({ username: name, bio, requiredAgree, marketingAgree })], { type: 'application/json' }),
  );

  if (profileImage) {
    formData.append('profileImage', profileImage, profileImage.name);
  } else {
    formData.append('profileImage', new Blob([]), '');
  }

  return formData;
};

export const createSignup = (payload: SignupPayload): Promise<SignupResponse> =>
  apiRequest<SignupResponse>('/users/onboarding', {
    method: 'POST',
    body: createSignupFormData(payload),
  });
