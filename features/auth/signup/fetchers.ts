import { apiRequest } from '@/shared/lib/api';

import type { OnboardingRequest } from './types';

export const createOnboarding = (data: OnboardingRequest): Promise<{ userId: number }> =>
  apiRequest<{ userId: number }>('/users/onboarding', { method: 'POST', body: data });
