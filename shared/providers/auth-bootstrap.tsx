'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { getMyProfile } from '@/features/auth/fetchers';
import { mapProfileToSessionUser } from '@/features/auth/lib/map-profile-to-session';
import { ROUTES } from '@/shared/constants/routes';
import { ApiError } from '@/shared/lib/api';
import { clearAuthToken, getAuthToken } from '@/shared/lib/auth-token';
import { clearSessionUser, getSessionUserFromStorage, setSessionUser } from '@/shared/lib/session-user';

export const AuthBootstrap = () => {
  const didRun = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (didRun.current) {
      return;
    }
    didRun.current = true;

    const token = getAuthToken();
    if (!token || getSessionUserFromStorage()) {
      return;
    }

    void getMyProfile()
      .then((profile) => {
        if (!profile.username?.trim()) {
          router.replace(ROUTES.SIGNUP);
          return;
        }
        setSessionUser(mapProfileToSessionUser(profile));
      })
      .catch((error) => {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearAuthToken();
          clearSessionUser();
        }
      });
  }, [router]);

  return null;
};
