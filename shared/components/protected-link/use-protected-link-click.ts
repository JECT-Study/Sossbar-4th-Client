'use client';

import type { ComponentProps, MouseEventHandler } from 'react';

import { useMyProfile } from '@/features/profile';
import { openLoginModalOnPage } from '@/shared/lib/login-modal/open-login-modal-on-page';

import type Link from 'next/link';

export const useProtectedLinkClick = (onClick: ComponentProps<typeof Link>['onClick']) => {
  const { data: profile } = useMyProfile();
  const isAuthenticated = profile != null;

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || isAuthenticated) {
      return;
    }

    event.preventDefault();
    openLoginModalOnPage();
  };

  return handleClick;
};
