'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { LoginDialog } from '@/shared/components/dialog/login-dialog';
import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header/header';

export const AppShell = ({ children }: { children: ReactNode }) => {
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
        <LoginDialog />
      </Suspense>
    </>
  );
};
