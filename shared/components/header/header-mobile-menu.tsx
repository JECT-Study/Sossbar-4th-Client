'use client';

import Link from 'next/link';
import { Avatar } from 'radix-ui';
import { useEffect } from 'react';

import { MenuIcon, XIcon } from '@/shared/assets/icons';
import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';
import { cn } from '@/shared/lib/cn';

const MOBILE_MENU_LINKS = [
  { href: '/projects', label: '프로젝트 관리', requiresAuth: true },
  { href: ROUTES.MY_SOSS, label: '내 소스', requiresAuth: true },
  { href: ROUTES.PROFILE_EXAMPLES, label: '프로필 예시 보기', requiresAuth: false },
  { href: ROUTES.MY_PAGE, label: '마이페이지', requiresAuth: false },
] as const;

type HeaderMobileMenuProps = {
  avatarSrc: string;
  displayName: string;
  className?: string;
};

const menuItemClassName =
  'text-body-base text-text-subtle border-surface-gray-subtle flex min-h-14 w-full items-center border-b px-5 font-medium';

export const HeaderMobileMenu = ({ avatarSrc, displayName, className }: HeaderMobileMenuProps) => {
  const [isOpen, , close, toggle] = useBooleanState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleNavigate = () => {
    close();
  };

  return (
    <div className={cn('lg:hidden', className)}>
      <button
        type="button"
        onClick={toggle}
        className="hover:bg-surface-gray-subtler focus-visible:ring-border-primary inline-flex size-11 items-center justify-center rounded-lg outline-none focus-visible:ring-2"
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isOpen}
      >
        {isOpen ? <XIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
      </button>

      {isOpen ? (
        <div className="border-divider-gray-light bg-surface-white fixed inset-x-0 top-[61px] bottom-0 z-30 border-t">
          <nav aria-label="모바일 메뉴" className="flex flex-col">
            <div className={cn(menuItemClassName, 'gap-3')}>
              <Avatar.Root className="bg-surface-gray-subtle relative size-7 shrink-0 overflow-hidden rounded-full">
                <Avatar.Image src={avatarSrc} alt={`${displayName}의 프로필 이미지`} />
                <Avatar.Fallback>{displayName.charAt(0)}</Avatar.Fallback>
              </Avatar.Root>
              <span className="font-bold">{displayName}님</span>
            </div>

            {MOBILE_MENU_LINKS.map(({ href, label, requiresAuth }) =>
              requiresAuth ? (
                <ProtectedLink key={label} href={href} className={menuItemClassName} onClick={handleNavigate}>
                  {label}
                </ProtectedLink>
              ) : (
                <Link key={label} href={href} className={menuItemClassName} onClick={handleNavigate}>
                  {label}
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
};
