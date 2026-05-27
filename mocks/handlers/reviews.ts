import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

const mockTags = [
  { tagId: 1, name: '응답이 빨라요' },
  { tagId: 2, name: '적극적이에요' },
  { tagId: 3, name: '아이디어가 많아요' },
  { tagId: 4, name: '꼼꼼해요' },
  { tagId: 5, name: '약속을 잘 지켜요' },
  { tagId: 6, name: '피드백을 잘 수용해요' },
  { tagId: 7, name: '문서 정리를 잘 해요' },
  { tagId: 8, name: '마감을 잘 지켜요' },
  { tagId: 9, name: '시간 조율을 잘 해요' },
  { tagId: 10, name: '팀 분위기를 좋게 만들어요' },
  { tagId: 11, name: '실행력이 좋아요' },
  { tagId: 12, name: '작업 속도가 빨라요' },
  { tagId: 13, name: '팀원들을 잘 도와줘요' },
  { tagId: 14, name: '센스가 좋아요' },
  { tagId: 15, name: '문제 해결을 잘 해요' },
  { tagId: 16, name: '일정 관리를 잘 해요' },
  { tagId: 17, name: '끈기있어요' },
  { tagId: 18, name: '고마움을 잘 표현해요' },
  { tagId: 19, name: '먼저 친근하게 다가와요' },
  { tagId: 20, name: '모르는 것을 숨기지 않고 물어봐요' },
];

const mockSpectrumAxisInfos = [
  {
    spectrumAxisId: 1,
    axisName: '서포트형-리드형',
    averageStrength: 4,
    totalCount: 8,
    leftStrengthCount: 1,
    rightStrengthCount: 7,
  },
  {
    spectrumAxisId: 2,
    axisName: '작업속도',
    averageStrength: 2,
    totalCount: 8,
    leftStrengthCount: 5,
    rightStrengthCount: 1,
  },
  {
    spectrumAxisId: 3,
    axisName: '대처방식',
    averageStrength: 3,
    totalCount: 8,
    leftStrengthCount: 4,
    rightStrengthCount: 2,
  },
  {
    spectrumAxisId: 4,
    axisName: '관계지향',
    averageStrength: 4,
    totalCount: 8,
    leftStrengthCount: 0,
    rightStrengthCount: 6,
  },
];

const submittedReviews = new Set<string>();

export const reviewsHandlers = [
  http.post(`${BASE}/reviews`, async ({ request }) => {
    const body = (await request.json()) as {
      reviewReqDto?: { projectId?: number; revieweeId?: number };
      projectId?: number;
      revieweeId?: number;
    };

    const projectId = body.reviewReqDto?.projectId ?? body.projectId;
    const revieweeId = body.reviewReqDto?.revieweeId ?? body.revieweeId;

    if (projectId != null && revieweeId != null) {
      submittedReviews.add(`${projectId}-${revieweeId}`);
    }

    return new HttpResponse(null, { status: 201 });
  }),

  http.get(`${BASE}/form-data`, () => {
    return HttpResponse.json({ tags: mockTags, spectrums: mockSpectrumAxisInfos });
  }),

  http.get(`${BASE}/reviews`, () => {
    return HttpResponse.json([
      {
        reviewId: 1,
        projectId: 1,
        authorNickname: '익명',
        praise: '소통이 잘 되고 매우 꼼꼼하게 작업해주셨습니다.',
        improvement: '일정 관리를 좀 더 세밀하게 하면 좋을 것 같아요.',
        tags: [mockTags[0], mockTags[1]],
        spectrums: [
          { spectrumId: 1, value: 70 },
          { spectrumId: 2, value: 55 },
          { spectrumId: 3, value: 45 },
          { spectrumId: 4, value: 60 },
        ],
        createdAt: '2026-04-20T00:00:00Z',
      },
    ]);
  }),

  http.get(`${BASE}/reviews/tags`, () => {
    return HttpResponse.json(mockTags);
  }),

  http.get(`${BASE}/reviews/tags/:projectId`, () => {
    return HttpResponse.json(mockTags);
  }),

  http.get(`${BASE}/reviews/spectrums/:userId`, () => {
    return HttpResponse.json({ spectrumInfoResDtos: mockSpectrumAxisInfos });
  }),

  http.get(`${BASE}/reviews/spectrums/:userId/:projectId`, () => {
    return HttpResponse.json({ spectrumInfoResDtos: mockSpectrumAxisInfos });
  }),
];
