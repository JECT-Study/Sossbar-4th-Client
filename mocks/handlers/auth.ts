import { http, HttpResponse } from 'msw';

/**
 * 로그인 관련 목 API (`public/api명세서.csv` 기준)
 *
 * - GET  /api/v1/login/kakao?code=…     카카오 로그인 (토큰)
 * - POST /api/v1/login/local            개발용 이메일 로그인 (토큰)
 * - POST /api/v1/login/reissue          리프레시 (실서버는 HttpOnly 쿠키 기준)
 * - DELETE /api/v1/login/:userId        회원 탈퇴 (204)
 */
const BASE = '/api/v1';

const MOCK_USER_ID = 1;

/** 개발용 이메일 로그인 — 명세: 카카오 대신 이메일로 토큰 발급 검증용 */
const LOCAL_TEST_EMAIL = 'test@sossbar.dev';
const LOCAL_TEST_PASSWORD = 'sossbar123!';

const jsonError = (status: number, message: string) => HttpResponse.json({ message }, { status });

const withRefreshCookie = (body: Record<string, unknown>) =>
  HttpResponse.json(body, {
    headers: {
      'Set-Cookie': `refreshToken=mock-refresh-token-${MOCK_USER_ID}; Path=/; SameSite=Lax`,
    },
  });

export const authHandlers = [
  http.get(`${BASE}/login/kakao`, ({ request }) => {
    const code = new URL(request.url).searchParams.get('code');
    if (!code?.trim()) {
      return jsonError(400, '`code` query parameter is required');
    }

    return withRefreshCookie({
      accessToken: 'mock-kakao-access-token',
      userId: MOCK_USER_ID,
      email: 'kakao-user@sossbar.mock',
    });
  }),

  http.post(`${BASE}/login/local`, async ({ request }) => {
    let body: { email?: string; password?: string };
    try {
      body = (await request.json()) as { email?: string; password?: string };
    } catch {
      return jsonError(400, 'Invalid JSON body');
    }

    const email = body.email?.trim();
    const password = body.password;
    if (!email || !password) {
      return jsonError(400, '`email` and `password` are required');
    }

    if (email !== LOCAL_TEST_EMAIL || password !== LOCAL_TEST_PASSWORD) {
      return jsonError(401, 'Invalid email or password');
    }

    return withRefreshCookie({
      accessToken: 'mock-local-access-token',
      userId: MOCK_USER_ID,
      email,
    });
  }),

  http.post(`${BASE}/login/reissue`, ({ cookies }) => {
    if (!cookies.refreshToken) {
      // 명세상 HttpOnly 리프레시 쿠키가 없으면 갱신 불가에 가깝게 동작
      return jsonError(401, 'Refresh token cookie missing or invalid');
    }

    return withRefreshCookie({
      accessToken: 'mock-reissued-access-token',
    });
  }),

  http.delete(`${BASE}/login/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
