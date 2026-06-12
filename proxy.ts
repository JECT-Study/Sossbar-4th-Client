import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/mypage', '/personal', '/projects', '/reviews', '/profile', '/signup'];

/** OG 크롤러·초대 링크 수신자가 로그인 없이 접근해야 하는 경로 */
const isPublicShareRoute = (pathname: string, searchParams: URLSearchParams): boolean => {
  if (pathname.startsWith('/profile/')) {
    return true;
  }

  if (pathname === '/projects' && searchParams.has('inviteProjectId')) {
    return true;
  }

  if (pathname === '/reviews/new' && searchParams.has('projectId') && searchParams.has('revieweeId')) {
    return true;
  }

  return false;
};

export const proxy = (request: NextRequest) => {
  const { pathname, searchParams } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isProtected && !request.cookies.has('accessToken') && !isPublicShareRoute(pathname, searchParams)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api).*)'],
};
