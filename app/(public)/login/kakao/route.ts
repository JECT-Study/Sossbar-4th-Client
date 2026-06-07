import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.sossbar.com';
const RETURN_PATH_COOKIE = 'sossbar-login-return';

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

  const loginRes = await fetch(`${API_BASE}/api/v1/login/kakao?code=${encodeURIComponent(code)}`);

  if (!loginRes.ok) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const setCookieHeaders = loginRes.headers.getSetCookie();
  const accessTokenCookie = setCookieHeaders.find((c) => c.startsWith('accessToken='))?.split(';')[0] ?? '';

  const profileRes = await fetch(`${API_BASE}/api/v1/users/profile`, {
    headers: { Cookie: accessTokenCookie },
  });

  let destination: string;

  if (!profileRes.ok) {
    destination = '/signup';
  } else {
    const body = (await profileRes.json()) as { data?: { username?: string | null } };
    const needsOnboarding = !body.data?.username?.trim();

    if (needsOnboarding) {
      destination = '/signup';
    } else {
      const returnPath = request.cookies.get(RETURN_PATH_COOKIE)?.value;
      destination = returnPath ? decodeURIComponent(returnPath) : '/';
    }
  }

  const response = NextResponse.redirect(new URL(destination, request.url));
  setCookieHeaders.forEach((cookie) => forwardCookie(response, cookie));
  response.cookies.delete(RETURN_PATH_COOKIE);

  return response;
};
