import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

export const usersHandlers = [
  http.post(`${BASE}/users/onboarding`, () => {
    return HttpResponse.json({ data: { userId: 1 } }, { status: 201 });
  }),

  http.get(`${BASE}/users/profile`, () => {
    return HttpResponse.json({
      data: {
        userId: 1,
        nickname: '테스트유저',
        realName: '홍길동',
        bio: '안녕하세요, 협업을 좋아하는 개발자입니다.',
        profileImageUrl: null,
        email: 'test@example.com',
      },
    });
  }),

  http.patch(`${BASE}/users/profile`, () => {
    return HttpResponse.json({ data: { userId: 1 } });
  }),
];
