import type { ComponentProps, MouseEventHandler } from 'react';

import { useMyProfile } from '@/features/profile';
import { useLoginModal } from '@/shared/hooks/use-login-modal';

import type Link from 'next/link';

export const useProtectedLinkClick = (onClick: ComponentProps<typeof Link>['onClick']) => {
  const { data: profile } = useMyProfile();
  const isAuthenticated = profile !== null && profile !== undefined;
  const { openLoginModal } = useLoginModal({ isAuthenticated });

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || isAuthenticated) {
      return;
    }

    event.preventDefault();
    openLoginModal();
  };

  return handleClick;
};
