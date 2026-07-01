import type { ReactNode } from 'react';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchMyProfileOptional } from '@/features/profile';
import {
  isCrawlerUserAgent,
  isPublicShareRoute,
  ROUTE_PATHNAME_HEADER,
  ROUTE_SEARCH_HEADER,
} from '@/shared/lib/route-access';

interface Props {
  children: ReactNode;
}

const ProtectedLayout = async ({ children }: Props) => {
  const headersList = await headers();
  const pathname = headersList.get(ROUTE_PATHNAME_HEADER) ?? '';
  const searchParams = new URLSearchParams(headersList.get(ROUTE_SEARCH_HEADER) ?? '');

  const isOgCrawlerProfile = pathname.startsWith('/profile/') && isCrawlerUserAgent(headersList.get('user-agent'));

  if (isPublicShareRoute(pathname, searchParams) || isOgCrawlerProfile) {
    return children;
  }

  const cookieStore = await cookies();
  const profile = await fetchMyProfileOptional({ headers: { Cookie: cookieStore.toString() } });

  if (!profile) {
    redirect('/');
  }

  return children;
};

export default ProtectedLayout;
