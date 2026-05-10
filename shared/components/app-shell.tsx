'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header';

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
      <Header />
      <hr className="fixed top-[64px] right-0 left-0 z-40 border-t border-gray-200" />
      <main className="flex-1">{children}</main>
      <Footer variant={footerVariant} />
    </>
  );
};
