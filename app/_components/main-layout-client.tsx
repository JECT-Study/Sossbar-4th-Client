'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { Footer } from '@/shared/components/footer';

interface Props {
  children: ReactNode;
  header: ReactNode;
}

/**
 * pathname 기준으로 공통 UI(chrome) 표시 여부를 결정한다.
 * - /signup: 온보딩 전용 화면 → 헤더·푸터·로그인 모달 숨김
 * - /: 홈 푸터 dark, 그 외 light
 */
export const MainLayoutClient = ({ children, header }: Props) => {
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
