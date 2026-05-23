'use client';

import type { ComponentProps, MouseEvent, Ref } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { forwardRef } from 'react';

import { useSessionUser } from '@/shared/lib/session-user';

type AuthGateLinkProps = ComponentProps<typeof Link>;

export const AuthGateLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, AuthGateLinkProps>(
  ({ href, onClick, children, className, ...props }, ref) => {
    const sessionUser = useSessionUser();
    const pathname = usePathname();
    const router = useRouter();

    const openLoginModal = () => {
      const params = new URLSearchParams(window.location.search);
      params.set('modal', 'login');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (sessionUser) {
      return (
        <Link ref={ref as Ref<HTMLAnchorElement>} href={href} onClick={onClick} className={className} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={className}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          onClick?.(event as unknown as MouseEvent<HTMLAnchorElement>);
          openLoginModal();
        }}
      >
        {children}
      </button>
    );
  },
);

AuthGateLink.displayName = 'AuthGateLink';
