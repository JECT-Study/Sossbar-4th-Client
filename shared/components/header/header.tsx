import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { HeaderLogoLink } from './header-logo-link';
import { HeaderMainNav } from './header-main-nav';

interface HeaderProps {
  avatarSlot: ReactNode;
  avatarFallback?: ReactNode;
}

export const Header = ({ avatarSlot, avatarFallback }: HeaderProps) => {
  return (
    <header className="border-divider-1 py-padding-m lg:px-padding-l sticky top-0 z-20 border-b bg-white/45 px-5 backdrop-blur-[10px]">
      <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between gap-2">
        <div className="gap-margin-xl flex h-10 min-w-0 items-center">
          <HeaderLogoLink />
          <div className="hidden lg:block">
            <Suspense fallback={<div className="h-10 w-48" aria-hidden />}>
              <HeaderMainNav />
            </Suspense>
          </div>
        </div>
        <Suspense fallback={avatarFallback ?? null}>{avatarSlot}</Suspense>
      </div>
    </header>
  );
};
