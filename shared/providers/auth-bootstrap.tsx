'use client';

import { useEffect, useRef } from 'react';

import { getMyProfile } from '@/features/auth/fetchers';
import { mapProfileToSessionUser } from '@/features/auth/lib/map-profile-to-session';
import { clearAuthToken, getAuthToken } from '@/shared/lib/auth-token';
import { getSessionUserFromStorage, setSessionUser } from '@/shared/lib/session-user';

export const AuthBootstrap = () => {
  const didRun = useRef(false);

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
      .then((profile) => setSessionUser(mapProfileToSessionUser(profile)))
      .catch(() => clearAuthToken());
  }, []);

  return null;
};
