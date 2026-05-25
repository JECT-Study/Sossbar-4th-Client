import { apiRequest } from '@/shared/lib/api';
import { getApiOrigin } from '@/shared/lib/api/resolve-api-url';

import type { LoginInfoResDto } from './types';

/**
 * 카카오 code → 토큰 교환.
 * 브라우저 Redirect는 `/api/v1/login/kakao` → `beforeFiles`로 `/login/kakao` 페이지로 옮기고,
 * 여기서의 API 호출은 rewrite에 걸리지 않도록 `NEXT_PUBLIC_API_ORIGIN`(또는 BASE)으로 BE에 직접 요청합니다.
 */
export const kakaoLogin = (code: string): Promise<LoginInfoResDto> => {
  const path = `/login/kakao?code=${encodeURIComponent(code)}`;
  const origin = getApiOrigin() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, '') || '';

  if (origin) {
    return apiRequest<LoginInfoResDto>(path, {
      method: 'GET',
      basePath: `${origin}/api/v1`,
    });
  }

  return apiRequest<LoginInfoResDto>(path, { method: 'GET' });
};
