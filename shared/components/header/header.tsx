import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { KakaoLoginButton } from '@/features/auth';

import { HeaderLogoLink } from './header-logo-link';
import { HeaderMainNav } from './header-main-nav';

interface HeaderProps {
  avatarSlot: ReactNode;
}

export const Header = ({ avatarSlot }: HeaderProps) => {
  return (
    <header className="border-divider-1 px-padding-l py-padding-m sticky top-0 z-50 border-b bg-white/45 backdrop-blur-[10px]">
      <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between">
        <div className="gap-margin-xl flex h-10 min-w-0 items-center">
          <HeaderLogoLink />
          <Suspense fallback={<div className="h-10 w-48" aria-hidden />}>
            <HeaderMainNav />
          </Suspense>
        </div>
        <Suspense fallback={<KakaoLoginButton />}>{avatarSlot}</Suspense>
      </div>
    </header>
  );
};
