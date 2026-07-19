'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

export const HEADER_NAV_LINKS = [
  { href: ROUTES.MY_SOSS, label: '내 소스', requiresAuth: true },
  { href: '/projects', label: '프로젝트 관리', requiresAuth: true },
  { href: ROUTES.PROFILE_EXAMPLES, label: '소스 예시 보기', requiresAuth: false },
] as const;

const getNavLinkClassName = (isActive: boolean) =>
  cn(
    'inline-flex h-10 min-w-[68px] shrink-0 items-center justify-center rounded-md px-5',
    'text-body-base font-medium text-text-subtle transition-colors',
    'hover:bg-button-tertiary-fill-hover',
    isActive && 'text-text-basic',
  );

export const HeaderMainNav = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴" className="h-10">
      <ul className="gap-margin-m flex h-10 items-center">
        {HEADER_NAV_LINKS.map(({ href, label, requiresAuth }) => {
          const isActive = pathname === href;
          const linkClassName = getNavLinkClassName(isActive);

          return (
            <li key={label} className="h-10">
              {requiresAuth ? (
                <ProtectedLink href={href} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
                  {label}
                </ProtectedLink>
              ) : (
                <Link href={href} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
