'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { LoginModal } from '@/shared/components/dialog/login-modal';
import { Footer } from '@/shared/components/footer';
import { GoogleAnalyticsPageView } from '@/shared/components/google-analytics-page-view';
import { Header } from '@/shared/components/header/header';

const AppShellInner = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith('/signup') ?? false;
  const isHome = pathname === '/' || pathname === '/login';
  const footerVariant = isHome ? 'dark' : 'light';

  if (hideChrome) {
    return children;
  }

  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer variant={footerVariant} />
      <Suspense fallback={null}>
        <LoginModal />
      </Suspense>
    </>
  );
};

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsPageView />
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
};
