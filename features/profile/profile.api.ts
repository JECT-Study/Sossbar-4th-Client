import { ApiError, apiRequest } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type { MyProfile, PublicProfile, UpdateProfilePayload, UpdateProfileResponse } from './profile.types';

/** 미로그인·인증 실패 시 API가 반환하는 HTTP status (guest → `null`) */
const UNAUTHENTICATED_STATUSES = new Set([401, 403]);

export const fetchMyProfile = (init?: ApiRequestOptions): Promise<MyProfile> => apiRequest('/users/profile', init);

/**
 * 내 프로필 조회. 미로그인(401/403)은 에러 대신 `null`을 반환한다.
 * SSR prefetch·useSuspenseQuery에서 guest/session 만료를 안전하게 처리하기 위함.
 */
export const fetchMyProfileOptional = async (init?: ApiRequestOptions): Promise<MyProfile | null> => {
  try {
    return await fetchMyProfile(init);
  } catch (error) {
    if (error instanceof ApiError && UNAUTHENTICATED_STATUSES.has(error.status)) {
      return null;
    }
    throw error;
  }
};

export const fetchProfileById = (userLink: string, init?: ApiRequestOptions): Promise<PublicProfile> =>
  apiRequest<PublicProfile>(`/users/profile/${userLink}`, init);

const createUpdateProfileFormData = ({ info, profileImage }: UpdateProfilePayload) => {
  const formData = new FormData();

  formData.append('info', new Blob([JSON.stringify(info)], { type: 'application/json' }));
  formData.append('profileImage', profileImage ?? '');

  return formData;
};

export const updateProfile = (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> =>
  apiRequest<UpdateProfileResponse>('/users/profile', {
    method: 'PATCH',
    body: createUpdateProfileFormData(payload),
  });
