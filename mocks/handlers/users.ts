import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

type MockProfile = {
  userId: number;
  username: string | null;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  userType: string;
};

const mockProfile: MockProfile = {
  userId: 1,
  username: null,
  email: 'kakao-user@sossbar.mock',
  bio: null,
  profileImageUrl: null,
  userType: 'KAKAO',
};

export const usersHandlers = [
  http.get(`${BASE}/users/:userId/reviews`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: [],
    });
  }),

  http.get(`${BASE}/users/profile`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: { ...mockProfile },
    });
  }),

  http.post(`${BASE}/users/onboarding`, async ({ request }) => {
    const formData = await request.formData();
    const onboardingPart = formData.get('onboarding');

    let username = '';
    let bio = '';

    if (onboardingPart instanceof Blob) {
      const parsed = JSON.parse(await onboardingPart.text()) as {
        username?: string;
        bio?: string;
        requiredAgree?: boolean;
        marketingAgree?: boolean;
      };
      username = parsed.username ?? '';
      bio = parsed.bio ?? '';
    }

    mockProfile.username = username;
    mockProfile.bio = bio;

    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '요청이 성공했습니다.',
      data: {
        userId: mockProfile.userId,
        username,
        nickname: username,
        email: mockProfile.email,
        bio,
        profileImageUrl: null,
        userType: 'KAKAO',
      },
    });
  }),
];
