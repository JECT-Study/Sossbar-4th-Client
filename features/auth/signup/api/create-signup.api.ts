import { apiRequest } from '@/shared/lib/api';

import type { SignupPayload, SignupResponse } from '../types';

const createSignupFormData = ({ name, bio, requiredAgree, profileImage, positions, links }: SignupPayload) => {
  const formData = new FormData();

  formData.append(
    'onboarding',
    new Blob(
      [
        JSON.stringify({
          username: name,
          bio,
          defaultPositions: positions,
          links,
          requiredAgree,
          // marketingAgree는 별도 수집 없이 전송 시점에만 true로 고정
          marketingAgree: true,
        }),
      ],
      { type: 'application/json' },
    ),
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
