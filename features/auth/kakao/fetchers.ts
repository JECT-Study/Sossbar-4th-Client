import { apiRequest } from '@/shared/lib/api';

import type { LoginInfoResDto, UserInfoResDto } from './types';

export const kakaoLogin = (code: string): Promise<LoginInfoResDto> =>
  apiRequest<LoginInfoResDto>(`/login/kakao?code=${encodeURIComponent(code)}`, {
    method: 'GET',
    credentials: 'include',
  });

export const getMyProfile = (): Promise<UserInfoResDto> => apiRequest<UserInfoResDto>('/users/profile');
