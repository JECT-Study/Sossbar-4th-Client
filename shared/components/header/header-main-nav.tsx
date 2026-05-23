'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import { useSessionUser } from '@/shared/lib/session-user';

import { Button } from '../button/button';

const navLinks = (userId: number | null) =>
  [
    { href: userId ? ROUTES.PROFILE(userId) : '/', label: '내 프로필' },
    { href: '/projects', label: '프로젝트 관리' },
    { href: '/profile-examples', label: '프로필 예시 보기' },
  ] as const;

export const HeaderMainNav = () => {
  const pathname = usePathname();
  const sessionUser = useSessionUser();
  const userId = sessionUser?.userId ?? null;

  return (
    <nav aria-label="주요 메뉴">
      <ul className="flex items-center gap-4">
        {navLinks(userId).map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={label}>
              <Button asChild size="small" variant="tertiary">
                <Link href={href} className={cn('h-10 px-5', isActive && 'bg-surface-gray-subtle rounded-md')}>
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
