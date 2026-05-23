import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';
const PROFILE_IMAGE_URL = '/default-profile.png';

const mockProfile = {
  userId: 1,
  username: '김이름',
  nickname: '김이름',
  email: '@daum.net',
  bio: '안녕하세요',
  profileImageUrl: PROFILE_IMAGE_URL,
  userType: 'KAKAO',
};

type MockProfileInfo = {
  nickname?: string;
  bio?: string;
};

const parseProfileInfo = async (formData: FormData): Promise<MockProfileInfo> => {
  const info = formData.get('info');

  if (typeof info === 'string') {
    return JSON.parse(info) as MockProfileInfo;
  }

  if (info instanceof File) {
    return JSON.parse(await info.text()) as MockProfileInfo;
  }

  return {};
};

export const profileHandlers = [
  http.get(`${BASE}/users/profile/:userId`, ({ params }) => {
    const userId = Number(params.userId);

    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {
        ...mockProfile,
        userId,
      },
    });
  }),

  http.patch(`${BASE}/users/profile`, async ({ request }) => {
    const formData = await request.formData();
    const info = await parseProfileInfo(formData);
    const profileImage = formData.get('profileImage');

    mockProfile.nickname = info.nickname ?? mockProfile.nickname;
    mockProfile.bio = info.bio ?? mockProfile.bio;
    mockProfile.profileImageUrl =
      profileImage instanceof File && profileImage.size > 0 ? PROFILE_IMAGE_URL : mockProfile.profileImageUrl;

    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 수정하였습니다.',
      data: mockProfile,
    });
  }),
];
