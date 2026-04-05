'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { Footer } from '@/shared/components/footer';
import { Header } from '@/shared/components/header';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const hideChrome = (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) ?? false;

  if (hideChrome) {
    return children;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};
