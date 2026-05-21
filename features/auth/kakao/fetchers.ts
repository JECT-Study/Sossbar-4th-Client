import { apiRequest } from '@/shared/lib/api';

import type { LoginInfoResDto } from './types';

export const kakaoLogin = (code: string): Promise<LoginInfoResDto> =>
  apiRequest<LoginInfoResDto>(`/login/kakao?code=${encodeURIComponent(code)}`, { method: 'GET' });
