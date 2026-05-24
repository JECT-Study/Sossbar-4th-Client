'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { LoginModal } from '@/shared/components/dialog/login-modal';
import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header/header';
import { AuthBootstrap } from '@/shared/providers/auth-bootstrap';

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
      <AuthBootstrap />
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
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
};
