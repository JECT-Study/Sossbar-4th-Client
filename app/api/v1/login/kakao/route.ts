import { type NextRequest, NextResponse } from 'next/server';

// Strip Domain so the cookie is scoped to this proxy origin, not the upstream backend.
// If the backend sets Domain=youhayeong.shop, browsers silently reject the cookie for sossbar.vercel.app.
const stripDomainAttribute = (rawSetCookie: string): string =>
  rawSetCookie
    .split(';')
    .filter((part) => !part.trim().toLowerCase().startsWith('domain='))
    .join(';');

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: 'code is required' }, { status: 400 });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

  let backendRes: Response;
  try {
    backendRes = await fetch(`${apiBase}/api/v1/login/kakao?code=${encodeURIComponent(code)}`, {
      headers: { Accept: 'application/json' },
    });
  } catch {
    return NextResponse.json({ message: '서버에 연결할 수 없습니다.' }, { status: 503 });
  }

  const body = await backendRes.text();
  const response = new NextResponse(body, {
    status: backendRes.status,
    headers: { 'content-type': backendRes.headers.get('content-type') ?? 'application/json' },
  });

  const rawCookie = backendRes.headers.get('set-cookie');
  if (rawCookie) {
    response.headers.set('set-cookie', stripDomainAttribute(rawCookie));
  }

  return response;
};
