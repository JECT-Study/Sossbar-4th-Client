'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { KakaoLoginButton } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes';

import { HeaderMyProfile } from './header-my-profile';
import { useMyProfile } from '../hooks/use-my-profile.query';

export const HeaderAuthGate = () => {
  const { data: myProfileFromQuery } = useMyProfile();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const myProfile = hasLoggedOut ? null : myProfileFromQuery;

  const handleLogout = async () => {
    setHasLoggedOut(true);
    await fetch('/api/logout', { method: 'POST' });
    queryClient.clear();
    router.push(ROUTES.HOME);
  };

  if (!myProfile) {
    return <KakaoLoginButton />;
  }
  return <HeaderMyProfile myProfile={myProfile} onLogout={handleLogout} />;
};
