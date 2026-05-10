'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

import { buttonVariants } from './button/button';

const navLinks = [
  { href: ROUTES.MY_PAGE, label: '내 프로필', widthClassName: 'w-[100px]' },
  { href: '#', label: '프로젝트 관리', widthClassName: 'w-[127px]' },
  { href: '#', label: '프로필 예시 보기', widthClassName: 'w-[145px]' },
] as const;

export const HeaderMainNav = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴">
      <ul className="flex items-center gap-4">
        {navLinks.map(({ href, label, widthClassName }) => {
          const isActive = href !== '#' && pathname === href;
          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  buttonVariants({ variant: 'tertiary', size: 'small' }),
                  'h-10 px-0',
                  widthClassName,
                  isActive && 'bg-surface-gray-subtle rounded-md',
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
