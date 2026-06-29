'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { Footer } from '@/shared/components/footer';

interface Props {
  children: ReactNode;
  header: ReactNode;
}

export const LayoutClient = ({ children, header }: Props) => {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith('/signup') ?? false;
  const footerVariant = pathname === '/' ? 'dark' : 'light';

  if (hideChrome) {
    return children;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      <Footer variant={footerVariant} />
    </>
  );
};
