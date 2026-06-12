import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const RETURN_PATH_COOKIE = 'sossbar-login-return';

export const middleware = (request: NextRequest) => {
  const isAuthenticated = !!(request.cookies.get('accessToken') || request.cookies.get('refreshToken'));

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const returnPath = `${pathname}${search}`;

  const response = NextResponse.redirect(new URL('/?modal=login', request.url));

  response.cookies.set(RETURN_PATH_COOKIE, encodeURIComponent(returnPath), {
    path: '/',
    sameSite: 'lax',
    maxAge: 300,
  });

  return response;
};

export const config = {
  matcher: ['/profile/:userId+', '/reviews/new'],
};
