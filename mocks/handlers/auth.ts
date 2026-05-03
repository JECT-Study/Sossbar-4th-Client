import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

export const authHandlers = [
  http.get(`${BASE}/login/kakao`, () => {
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      userId: 1,
    });
  }),

  http.post(`${BASE}/login/local`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      userId: 1,
      email: body.email,
    });
  }),

  http.post(`${BASE}/login/reissue`, () => {
    return HttpResponse.json({ accessToken: 'mock-new-access-token' });
  }),

  http.delete(`${BASE}/login/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
