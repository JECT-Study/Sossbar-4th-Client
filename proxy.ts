import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/mypage', '/personal', '/projects', '/reviews', '/profile', '/signup'];

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isProtected && !request.cookies.has('accessToken')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api).*)'],
};
