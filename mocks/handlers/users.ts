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
    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const bio = formData.get('bio') as string | null;

    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '요청이 성공했습니다.',
      data: {
        userId: 1,
        username: name,
        nickname: name,
        email: 'test@example.com',
        bio,
        profileImageUrl: null,
        userType: 'KAKAO',
      },
    });
  }),
];
