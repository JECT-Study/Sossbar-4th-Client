import { apiRequest } from '@/shared/lib/api';

import type { SignupPayload, SignupResponse } from '../types';

import { createSignupFormData } from './create-signup-form-data';

export const createSignup = (payload: SignupPayload): Promise<SignupResponse> =>
  apiRequest<SignupResponse>('/users/onboarding', {
    method: 'POST',
    body: createSignupFormData(payload),
  });
