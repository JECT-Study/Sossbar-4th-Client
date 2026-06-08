'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/shared/components/button';
import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

const NAV_LINKS = [
  { href: '/profile', label: '내 프로필', requiresAuth: true },
  { href: '/projects', label: '프로젝트 관리', requiresAuth: true },
  { href: ROUTES.PROFILE_EXAMPLES, label: '프로필 예시 보기', requiresAuth: false },
] as const;

export const HeaderMainNav = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴">
      <ul className="flex items-center gap-4">
        {NAV_LINKS.map(({ href, label, requiresAuth }) => {
          const isActive = pathname === href;
          const linkClassName = cn('h-10 px-5', isActive && 'bg-surface-gray-subtle rounded-md');

          return (
            <li key={label}>
              <Button asChild size="small" variant="tertiary">
                {requiresAuth ? (
                  <ProtectedLink href={href} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
                    {label}
                  </ProtectedLink>
                ) : (
                  <Link href={href} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
                    {label}
                  </Link>
                )}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
