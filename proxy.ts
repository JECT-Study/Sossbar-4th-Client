import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const RETURN_PATH_COOKIE = 'sossbar-login-return';

const PROTECTED_PREFIXES = ['/mypage', '/my-soss', '/personal', '/projects', '/reviews', '/profile', '/signup'];

const CRAWLER_UA_PATTERNS = [
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'kakaotalk',
  'googlebot',
  'bingbot',
];

const isCrawler = (request: NextRequest): boolean => {
  const ua = (request.headers.get('user-agent') ?? '').toLowerCase();
  return CRAWLER_UA_PATTERNS.some((pattern) => ua.includes(pattern));
};

/** OG 크롤러·초대 링크 수신자가 로그인 없이 접근해야 하는 경로 */
const isPublicShareRoute = (pathname: string, searchParams: URLSearchParams): boolean => {
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

  if (!isProtected || request.cookies.has('accessToken')) {
    return NextResponse.next();
  }

  if (isPublicShareRoute(pathname, searchParams)) {
    return NextResponse.next();
  }

  // 크롤러는 OG 메타데이터 수집을 위해 통과
  if (pathname.startsWith('/profile/') && isCrawler(request)) {
    return NextResponse.next();
  }

  // 공유 프로필: 홈 화면 위에 로그인 팝업 표시 + 복귀 경로 저장
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
