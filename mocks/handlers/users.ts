import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

export const usersHandlers = [
  http.get(`${BASE}/users/profile`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {
        userId: 1,
        username: '테스트유저',
        email: 'kakao-user@sossbar.mock',
        bio: null,
        profileImageUrl: null,
        userType: 'KAKAO',
      },
    });
  }),

  http.post(`${BASE}/users/onboarding`, async ({ request }) => {
    const body = (await request.json()) as { name?: string; bio?: string };

    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '요청이 성공했습니다.',
      data: {
        userId: 1,
        username: body.name,
        nickname: body.name,
        email: 'test@example.com',
        bio: body.bio,
        profileImageUrl: null,
        userType: 'KAKAO',
      },
    });
  }),
];
