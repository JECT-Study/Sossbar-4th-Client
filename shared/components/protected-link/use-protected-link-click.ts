'use client';

import type { ComponentProps, MouseEventHandler } from 'react';

import { saveLoginReturnPath } from '@/features/auth/lib/login-return-path';
import { useMyProfile } from '@/features/profile';

import type Link from 'next/link';

const LOGIN_MODAL_PARAM = 'login';

const openLoginModalViaUrl = () => {
  saveLoginReturnPath();
  const params = new URLSearchParams(window.location.search);
  params.set('modal', LOGIN_MODAL_PARAM);
  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.pushState(null, '', nextUrl);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const useProtectedLinkClick = (onClick: ComponentProps<typeof Link>['onClick']) => {
  const { data: profile } = useMyProfile();
  const isAuthenticated = profile != null;

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || isAuthenticated) {
      return;
    }

    event.preventDefault();
    openLoginModalViaUrl();
  };

  return handleClick;
};
