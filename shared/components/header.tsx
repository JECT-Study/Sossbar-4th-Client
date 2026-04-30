import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/lib/cn';

import { buttonVariants } from './button';

const navLinks = [
  { href: '#', label: '내 프로필', widthClassName: 'w-[100px]' },
  { href: '#', label: '프로젝트 관리', widthClassName: 'w-[127px]' },
  { href: '#', label: '프로필 예시 보기', widthClassName: 'w-[145px]' },
] as const;

export const Header = () => {
  return (
    <header className="bg-gray-0/95 sticky top-0 z-50 border-b border-gray-200 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:h-16 sm:gap-6 sm:px-6 lg:px-0">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="relative flex h-[36px] shrink-0 items-center">
            <Image src="/Sossbar_logo.svg" alt="Sossbar" width={161} height={36} className="h-[36px] w-auto" priority />
          </Link>
          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-4">
              {navLinks.map(({ href, label, widthClassName }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(buttonVariants({ variant: 'tertiary', size: 'small' }), 'h-10 px-0', widthClassName)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link href="/login" className={cn(buttonVariants({ variant: 'primary' }), 'h-10 w-[90px] px-0')}>
          로그인
        </Link>
      </div>
    </header>
  );
};
