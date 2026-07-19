'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { MenuIcon, XIcon } from '@/shared/assets/icons';
import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';
import { useBooleanState } from '@/shared/hooks/use-boolean-state';
import { cn } from '@/shared/lib/cn';

import { HEADER_NAV_LINKS } from './header-main-nav';

type HeaderMobileMenuProps = {
  onLogout: () => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const menuItemClassName =
  'text-body-base text-text-basic flex h-12 w-full items-center rounded-md px-4 font-medium hover:bg-button-tertiary-fill-hover';

export const HeaderMobileMenu = ({ onLogout, onOpenChange, className }: HeaderMobileMenuProps) => {
  const [isOpen, , close, toggle] = useBooleanState(false);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

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
          <nav aria-label="모바일 메뉴" className="flex flex-col gap-1 px-5 py-4">
            {HEADER_NAV_LINKS.map(({ href, label, requiresAuth }) =>
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
            <Link href={ROUTES.MY_PAGE} className={menuItemClassName} onClick={handleNavigate}>
              마이페이지
            </Link>
            <button
              type="button"
              className={cn(menuItemClassName, 'text-left')}
              onClick={() => {
                close();
                onLogout();
              }}
            >
              로그아웃
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
};
