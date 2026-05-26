import type { ReactNode } from 'react';

import localFont from 'next/font/local';

import { AppShell } from '@/shared/components/app-shell';
import { MswProvider } from '@/shared/providers/msw-provider';
import { QueryProvider } from '@/shared/providers/query-provider';

import type { Metadata } from 'next';

import '@/styles/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sossbar.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sossbar',
    template: '%s',
  },
  description: '소프트 스킬 기반 협업 프로필 플랫폼',
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
        <QueryProvider>
          {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW !== 'false' ? (
            <MswProvider>
              <AppShell>{children}</AppShell>
            </MswProvider>
          ) : (
            <AppShell>{children}</AppShell>
          )}
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
