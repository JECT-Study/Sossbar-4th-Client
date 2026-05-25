import { apiRequest } from '@/shared/lib/api';

import type { LoginInfoResDto } from '../kakao/types';

export const testAccountLogin = (): Promise<LoginInfoResDto> =>
  apiRequest<LoginInfoResDto>('/login/test-account', { method: 'POST' });
