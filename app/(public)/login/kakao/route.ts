import { NextResponse } from 'next/server';

import {
  exchangeKakaoCode,
  fetchNeedsOnboarding,
  resolveKakaoLoginDestination,
  LOGIN_RETURN_COOKIE_NAME,
} from '@/features/auth';

import type { NextRequest } from 'next/server';

// Set-Cookie 헤더 문자열을 파싱해 response.cookies.set()으로 주입
// - Domain= 은 의도적으로 무시 (백엔드 도메인 쿠키를 localhost에 그대로 쓰면 브라우저가 거부)
// - response.headers.append('Set-Cookie') 방식은 Next.js redirect 응답에서 신뢰성 낮음
const forwardCookie = (response: NextResponse, rawCookie: string): void => {
  const parts = rawCookie.split(';').map((p) => p.trim());
  const firstEq = parts[0].indexOf('=');
  if (firstEq === -1) {
    return;
  }

  const name = parts[0].slice(0, firstEq);
  const value = parts[0].slice(firstEq + 1);

  const options: Parameters<typeof response.cookies.set>[2] = {};

  for (const attr of parts.slice(1)) {
    const lower = attr.toLowerCase();
    if (lower === 'httponly') {
      options.httpOnly = true;
    } else if (lower === 'secure') {
      options.secure = true;
    } else if (lower.startsWith('path=')) {
      options.path = attr.slice(5);
    } else if (lower.startsWith('max-age=')) {
      options.maxAge = Number(attr.slice(8));
    } else if (lower.startsWith('samesite=')) {
      options.sameSite = lower.slice(9) as 'lax' | 'strict' | 'none';
    }
  }

  response.cookies.set(name, value, options);
};

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const login = await exchangeKakaoCode(code);

  if (!login.ok) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const needsOnboarding = await fetchNeedsOnboarding(login.accessTokenCookie);
  const returnPath = request.cookies.get(LOGIN_RETURN_COOKIE_NAME)?.value;
  const destination = resolveKakaoLoginDestination({ needsOnboarding, returnPath });

  const response = NextResponse.redirect(new URL(destination, request.url));
  login.setCookieHeaders.forEach((cookie) => forwardCookie(response, cookie));
  response.cookies.delete(LOGIN_RETURN_COOKIE_NAME);

  return response;
};
