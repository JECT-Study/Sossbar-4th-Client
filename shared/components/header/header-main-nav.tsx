'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AuthGateLink } from '@/shared/components/auth-gate-link';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

import { Button } from '../button/button';

const navLinks = [
  { href: ROUTES.MY_PAGE, label: '내 프로필', widthClassName: 'w-[100px]', requiresAuth: true },
  { href: '/projects', label: '프로젝트 관리', widthClassName: 'w-[127px]', requiresAuth: true },
  { href: ROUTES.PROFILE_EXAMPLES, label: '프로필 예시 보기', widthClassName: 'w-[145px]', requiresAuth: false },
] as const;

export const HeaderMainNav = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴">
      <ul className="flex items-center gap-4">
        {navLinks.map(({ href, label, widthClassName, requiresAuth }) => {
          const isActive = pathname === href;
          const linkClassName = cn('h-10 px-0', widthClassName, isActive && 'bg-surface-gray-subtle rounded-md');

          return (
            <li key={label}>
              <Button asChild size="small" variant="tertiary">
                {requiresAuth ? (
                  <AuthGateLink href={href} className={linkClassName}>
                    {label}
                  </AuthGateLink>
                ) : (
                  <Link href={href} className={linkClassName}>
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
