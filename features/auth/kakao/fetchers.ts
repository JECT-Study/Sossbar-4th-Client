import { apiRequest } from '@/shared/lib/api';
import { getApiOrigin } from '@/shared/lib/api/resolve-api-url';

import type { LoginInfoResDto } from './types';

export const kakaoLogin = (code: string): Promise<LoginInfoResDto> => {
  const path = `/login/kakao?code=${encodeURIComponent(code)}`;
  const origin = getApiOrigin();

  if (origin) {
    return apiRequest<LoginInfoResDto>(path, {
      method: 'GET',
      basePath: `${origin}/api/v1`,
    });
  }

  return apiRequest<LoginInfoResDto>(path, { method: 'GET' });
};
