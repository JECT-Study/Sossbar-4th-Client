import { NextResponse } from 'next/server';

import {
  isCrawlerUserAgent,
  isPublicShareRoute,
  ROUTE_PATHNAME_HEADER,
  ROUTE_SEARCH_HEADER,
} from '@/shared/lib/route-access';

import type { NextRequest } from 'next/server';

const RETURN_PATH_COOKIE = 'sossbar-login-return';

const PROTECTED_PREFIXES = ['/mypage', '/my-soss', '/personal', '/projects', '/reviews', '/profile', '/signup'];

const continueWithPathHeaders = (request: NextRequest) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(ROUTE_PATHNAME_HEADER, request.nextUrl.pathname);
  requestHeaders.set(ROUTE_SEARCH_HEADER, request.nextUrl.searchParams.toString());

  return NextResponse.next({ request: { headers: requestHeaders } });
};

export const proxy = (request: NextRequest) => {
  const { pathname, searchParams } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isProtected) {
    return continueWithPathHeaders(request);
  }

  if (isPublicShareRoute(pathname, searchParams)) {
    return continueWithPathHeaders(request);
  }

  if (pathname.startsWith('/profile/') && isCrawlerUserAgent(request.headers.get('user-agent'))) {
    return continueWithPathHeaders(request);
  }

  if (request.cookies.has('accessToken')) {
    return continueWithPathHeaders(request);
  }

  if (pathname.startsWith('/profile/')) {
    const query = searchParams.toString();
    const returnPath = query ? `${pathname}?${query}` : pathname;
    const response = NextResponse.redirect(new URL('/?modal=login', request.url));
    response.cookies.set(RETURN_PATH_COOKIE, encodeURIComponent(returnPath), {
      path: '/',
      sameSite: 'lax',
      maxAge: 300,
    });
    return response;
  }

  return NextResponse.redirect(new URL('/', request.url));
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api).*)'],
};
