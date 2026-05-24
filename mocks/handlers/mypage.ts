import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

const mockProfile = {
  userId: 1,
  username: '유하영',
  nickname: '유하영',
  email: '@daum.net',
  bio: '안녕하세요',
  profileImageUrl:
    'http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',
  userType: 'KAKAO',
};

export const mypageHandlers = [
  http.get(`${BASE}/users/profile`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: mockProfile,
    });
  }),
];
