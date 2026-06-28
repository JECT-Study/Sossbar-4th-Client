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

const mockUserReviews = [
  {
    reviewId: 1,
    projectName: 'IT 프로젝트',
    host: '테크 스타트업 컴퍼니',
    projectImage: null,
    createdAt: '2025-07-10T00:00:00',
    reviewerNickname: '익명의 동료',
    positiveFeedback:
      '코드 리뷰를 꼼꼼하게 해주시고, 모르는 부분도 편하게 질문할 수 있는 분위기를 만들어 주셔서 협업이 수월했어요. 문서 정리도 깔끔해서 온보딩이 빨랐습니다.',
    negativeFeedback: '일정 관리를 좀 더 세밀하게 하면 좋을 것 같아요.',
    projectStatus: 'COMPLETED',
  },
  {
    reviewId: 2,
    projectName: 'UX 리뉴얼',
    host: '디자인 에이전시',
    projectImage: null,
    createdAt: '2025-05-02T00:00:00',
    reviewerNickname: '익명의 동료',
    positiveFeedback:
      '피드백을 빠르게 반영해 주시고, 팀원들 의견을 잘 조율해 주셨어요. 덕분에 마감 전에 퀄리티 있는 결과물을 낼 수 있었습니다.',
    projectStatus: 'COMPLETED',
  },
] as const;

export const usersHandlers = [
  http.get(`${BASE}/users/:userId/reviews`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {
        reviews: mockUserReviews,
        nextCursor: null,
        hasNext: false,
      },
    });
  }),

  http.get(`${BASE}/users/:userId/projects/:projectId/reviews`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: mockUserReviews,
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
