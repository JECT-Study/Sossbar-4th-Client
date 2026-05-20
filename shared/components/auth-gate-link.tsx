'use client';

import Link from 'next/link';
import { forwardRef, type ComponentProps } from 'react';

import { useLoginModal } from '@/shared/hooks/use-login-modal';
import { useSessionUser } from '@/shared/lib/session-user';

type AuthGateLinkProps = ComponentProps<typeof Link>;

export const AuthGateLink = forwardRef<HTMLAnchorElement, AuthGateLinkProps>(
  ({ href, onClick, children, className, ...props }, ref) => {
    const sessionUser = useSessionUser();
    const { openLoginModal } = useLoginModal();

    if (sessionUser) {
      return (
        <Link ref={ref} href={href} onClick={onClick} className={className} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={className}
        onClick={(event) => {
          onClick?.(event as unknown as React.MouseEvent<HTMLAnchorElement>);
          openLoginModal();
        }}
      >
        {children}
      </button>
    );
  },
);

AuthGateLink.displayName = 'AuthGateLink';
