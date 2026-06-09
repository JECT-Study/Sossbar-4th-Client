import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { GoogleAnalyticsPageView } from '@/shared/components/google-analytics-page-view';

import { Header } from './header/header';
import { MainLayoutClient } from './main-layout-client';

interface Props {
  children: ReactNode;
}

/**
 * 앱 전역 페이지 틀 (Server Component).
 * GA 페이지뷰 + 클라이언트 레이아웃(헤더·푸터·로그인 모달)을 감싼다.
 */
export const MainLayout = ({ children }: Props) => {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsPageView />
      <MainLayoutClient header={<Header />}>{children}</MainLayoutClient>
    </Suspense>
  );
};
