'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

import { useMyProfile } from '@/features/profile';
import { Button } from '@/shared/components/button/button';
import { HeaderLogoLink } from '@/shared/components/header/header-logo-link';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

import { logout } from '../auth.api';
import { LoginButton } from './login-button';

const actionButtonClassName = 'h-10 min-w-[68px] shrink-0 rounded-md px-5 py-0';

const LandingHeaderFallback = () => {
  return (
    <header className="border-divider-gray-light py-padding-m lg:px-padding-l sticky top-0 z-50 border-b bg-white/50 px-5 backdrop-blur-[5px]">
      <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between">
        <HeaderLogoLink />
        <LoginButton />
      </div>
    </header>
  );
};

const LandingHeaderInner = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profileFromQuery } = useMyProfile();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const profile = hasLoggedOut ? null : profileFromQuery;
  const isLoggedIn = Boolean(profile);

  const handleLogout = async () => {
    setHasLoggedOut(true);
    // 백엔드 refreshToken 무효화(실패해도 로컬 로그아웃은 계속 진행)
    await logout();
    await fetch('/api/logout', { method: 'POST' });
    queryClient.clear();
    router.push(ROUTES.HOME);
  };

  return (
    <header
      className={cn(
        'py-padding-m lg:px-padding-l sticky top-0 z-20 border-b px-5',
        isLoggedIn
          ? 'border-divider-1 bg-white/45 backdrop-blur-[10px]'
          : 'border-divider-gray-light bg-white/50 backdrop-blur-[5px]',
      )}
    >
      <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between gap-2">
        <HeaderLogoLink />
        {isLoggedIn ? (
          <div className="flex items-center gap-1">
            <Button asChild variant="primary" size="medium" className={`${actionButtonClassName} sm:w-[139px]`}>
              <Link href={ROUTES.MY_SOSS}>Sossbar 열기</Link>
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="medium"
              className={`${actionButtonClassName} sm:w-[139px]`}
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
};

export const LandingHeader = () => {
  return (
    <Suspense fallback={<LandingHeaderFallback />}>
      <LandingHeaderInner />
    </Suspense>
  );
};
