'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { AuthGateLink } from '@/shared/components/auth-gate-link';
import { Button } from '@/shared/components/button';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

const navLinks = (userId: number | null) =>
  [
    { href: ROUTES.PROFILE(userId ?? ''), label: '내 프로필', requiresAuth: true },
    { href: '/projects', label: '프로젝트 관리', requiresAuth: true },
    { href: ROUTES.PROFILE_EXAMPLES, label: '프로필 예시 보기', requiresAuth: false },
  ] as const;

export const HeaderMainNav = () => {
  const pathname = usePathname();
  const { data: profile } = useMyProfile();
  const userId = profile?.userId ?? null;

  return (
    <nav aria-label="주요 메뉴">
      <ul className="flex items-center gap-4">
        {navLinks(userId).map(({ href, label, requiresAuth }) => {
          const isActive = pathname === href;
          const linkClassName = cn('h-10 px-5', isActive && 'bg-surface-gray-subtle rounded-md');

          return (
            <li key={label}>
              <Button asChild size="small" variant="tertiary">
                {requiresAuth ? (
                  <AuthGateLink href={href} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
                    {label}
                  </AuthGateLink>
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
