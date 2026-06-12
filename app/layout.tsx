import type { ReactNode } from 'react';

import localFont from 'next/font/local';

import { GoogleAnalytics } from '@/shared/components/google-analytics';
import { QueryProvider } from '@/shared/providers/query-provider';

import type { Metadata } from 'next';

import { MainLayout } from './_components/main-layout';

import '@/styles/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sossbar.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Sossbar - 프로젝트 동료와 성장 기록을 남기다',
  description: '함께한 동료의 피드백으로 협업 성향과 신뢰를 기록하는 성장 프로필 서비스',
  icons: {
    icon: [{ url: '/Sossbar-logo2.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Sossbar - 프로젝트 동료와 성장 기록을 남기다',
    description: '함께한 동료의 피드백으로 협업 성향과 신뢰를 기록하는 성장 프로필 서비스',
    type: 'website',
    url: siteUrl,
    siteName: 'Sossbar',
    images: [
      {
        url: '/Sossbar_logo.png',
        width: 1200,
        height: 630,
        alt: 'Sossbar',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sossbar - 프로젝트 동료와 성장 기록을 남기다',
    description: '함께한 동료의 피드백으로 협업 성향과 신뢰를 기록하는 성장 프로필 서비스',
    images: ['/Sossbar_logo.png'],
  },
};

const pretendard = localFont({
  src: '../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="bg-gray-0 flex min-h-screen flex-col text-gray-900 antialiased">
        <GoogleAnalytics />
        <QueryProvider>
          <MainLayout>{children}</MainLayout>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
