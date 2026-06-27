import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { HeaderAuthArea } from './header-auth-area';
import { HeaderMainNav } from './header-main-nav';

/**
 * 헤더 (Server Component).
 * myProfile prefetch는 MainLayout 전역 HydrationBoundary에서 처리한다.
 */
export const Header = () => {
  return (
    <header className="border-divider-1 px-padding-l py-padding-m sticky top-0 z-50 border-b bg-white/45 backdrop-blur-[10px]">
      <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between">
        <div className="gap-margin-xl flex h-10 min-w-0 items-center">
          <Link href="/" className="flex h-10 w-[122px] shrink-0 items-center">
            <Image
              src="/Sossbar_logo.svg"
              alt="Sossbar"
              width={161}
              height={36}
              className="h-9 w-[122px] object-contain object-left"
              priority
            />
          </Link>
          <Suspense fallback={<div className="h-10 w-48" aria-hidden />}>
            <HeaderMainNav />
          </Suspense>
        </div>
        <HeaderAuthArea />
      </div>
    </header>
  );
};
