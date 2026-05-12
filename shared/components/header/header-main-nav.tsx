'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/cn';

import { Button } from '../button/button';

const navLinks = [
  { href: '/mypage', label: '내 프로필', widthClassName: 'w-[100px]' },
  { href: '/projects', label: '프로젝트 관리', widthClassName: 'w-[127px]' },
  { href: '/profile-examples', label: '프로필 예시 보기', widthClassName: 'w-[145px]' },
] as const;

export const HeaderMainNav = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴">
      <ul className="flex items-center gap-4">
        {navLinks.map(({ href, label, widthClassName }) => {
          const isActive = pathname === href;
          return (
            <li key={label}>
              <Button asChild size="small" variant="tertiary">
                <Link
                  href={href}
                  className={cn('h-10 px-0', widthClassName, isActive && 'bg-surface-gray-subtle rounded-md')}
                >
                  {label}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
