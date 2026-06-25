import { ApiError, type ApiRequestOptions } from '@/shared/lib/api';

import type { Profile } from '../profile.types';

import { fetchMyProfile } from './fetch-my-profile';

/** 미로그인·인증 실패 시 API가 반환하는 HTTP status (guest → `null`) */
const UNAUTHENTICATED_STATUSES = new Set([401, 403]);

/**
 * 내 프로필 조회. 미로그인(401/403)은 에러 대신 `null`을 반환한다.
 * SSR prefetch·useSuspenseQuery에서 guest/session 만료를 안전하게 처리하기 위함.
 */
export const fetchMyProfileOptional = async (init?: ApiRequestOptions): Promise<Profile | null> => {
  try {
    return await fetchMyProfile(init);
  } catch (error) {
    if (error instanceof ApiError && UNAUTHENTICATED_STATUSES.has(error.status)) {
      return null;
    }
    throw error;
  }
};
