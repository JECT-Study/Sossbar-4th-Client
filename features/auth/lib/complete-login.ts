import { getMyProfile } from '@/features/auth/fetchers';
import type { LoginInfoResDto } from '@/features/auth/kakao/types';
import type { UserInfoResDto } from '@/features/auth/types';
import { setAuthToken } from '@/shared/lib/auth-token';
import { setSessionUser } from '@/shared/lib/session-user';

import { mapProfileToSessionUser } from './map-profile-to-session';

export type CompletedLogin = {
  profile: UserInfoResDto;
  needsOnboarding: boolean;
};

export const completeLoginSession = async (login: LoginInfoResDto): Promise<CompletedLogin> => {
  setAuthToken({ accessToken: login.accessToken, userId: login.userId });

  const profile = await getMyProfile();
  const needsOnboarding = !profile.username?.trim();

  if (!needsOnboarding) {
    setSessionUser(mapProfileToSessionUser(profile));
  }

  return { profile, needsOnboarding };
};
