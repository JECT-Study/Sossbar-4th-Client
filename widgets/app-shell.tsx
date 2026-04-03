'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith('/login') ?? false;

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
