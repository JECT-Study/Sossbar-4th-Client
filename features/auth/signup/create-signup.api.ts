import { apiRequest } from '@/shared/lib/api';

import type { SignupPayload, SignupResponse } from './types';

export const createSignup = ({ name, bio, requiredAgree, marketingAgree }: SignupPayload): Promise<SignupResponse> =>
  apiRequest<SignupResponse>('/users/onboarding', {
    method: 'POST',
    body: { username: name, bio, requiredAgree, marketingAgree },
  });
