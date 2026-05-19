import { apiRequest, assertApiData } from '@/shared/lib/api';

import type { SignupPayload, SignupResponse } from './types';

export const createSignup = ({ name, bio }: SignupPayload): Promise<SignupResponse> =>
  apiRequest<SignupResponse>('/users/onboarding', { method: 'POST', body: { name, bio } }).then(assertApiData);
