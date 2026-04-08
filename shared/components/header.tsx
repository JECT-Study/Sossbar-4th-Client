import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/lib/cn';

import { buttonVariants } from './button';

const navLinks = [
  { href: '/', label: '홈' },
  // NOTE: 로그인/인증 구현 전까지는 로그인 화면으로 연결합니다.
  { href: '/login', label: '내 프로필' },
  { href: '/login', label: '프로젝트 관리' },
  { href: '#', label: '데모 프로필' },
] as const;

export const Header = () => {
  return (
    <header className="bg-gray-0/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:gap-6 sm:px-6">
        <Link href="/" className="relative flex h-[36px] shrink-0 items-center">
          <Image src="/Sossbar_logo.svg" alt="Sossbar" width={161} height={36} className="h-[36px] w-auto" priority />
        </Link>

        <div className="flex min-w-0 items-center gap-4">
          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-4">
              {navLinks.map(({ href, label }) => (
                <li key={`${label}-${href}`}>
                  <Link href={href} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'primary' }), 'text-(--color-text-basic-inverse)')}
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
};
