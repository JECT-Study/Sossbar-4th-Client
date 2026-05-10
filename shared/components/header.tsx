import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from './button/button';
import { KakaoLoginButton } from './button/kakao-login-button';
import { HeaderAuthArea } from './header-auth-area';
import { HeaderMainNav } from './header-main-nav';

export const Header = () => {
  return (
    <header className="bg-gray-0/95 sticky top-0 border-b border-gray-200 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:h-16 sm:gap-6 sm:px-6 lg:px-0">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="relative flex h-[36px] shrink-0 items-center">
            <Image src="/Sossbar_logo.svg" alt="Sossbar" width={161} height={36} className="h-[36px] w-auto" priority />
          </Link>
          <HeaderMainNav />
        </div>
        <div className="flex shrink-0 items-center self-stretch">
          <HeaderAuthArea />
        </div>

        <Suspense fallback={<Button className="self-center">로그인</Button>}>
          <KakaoLoginButton />
        </Suspense>
      </div>
    </header>
  );
};
