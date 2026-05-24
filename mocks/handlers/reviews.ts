import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

/** 본인으로 간주할 사용자 ID. 이 값과 일치하면 negativeFeedback까지 포함해 응답한다. */
const MY_USER_ID = 1;

const mockReceivedReviews = [
  {
    reviewId: 1,
    projectName: '프로젝트 1',
    host: '주최사',
    positiveFeedback: '항상 책임감 있게 작업을 수행해주시고 협업 분위기도 좋게 이끌어주셨습니다.',
    negativeFeedback: '가끔 진행 상황 공유가 조금 늦어지는 점이 있었습니다.',
    reviewerNickname: '익명의 동료',
  },
  {
    reviewId: 2,
    projectName: '프로젝트 2',
    host: '사이드 프로젝트',
    positiveFeedback: '맡은 부분을 끝까지 책임지고 마무리해주셔서 믿고 협업할 수 있었어요.',
    negativeFeedback: '회의 때 의견을 조금 더 적극적으로 내주시면 좋겠어요.',
    reviewerNickname: '익명의 동료',
  },
] as const;

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

const mockReceivedTagCounts = [
  { tagId: 5, tagName: '약속을 잘 지켜요', count: 23 },
  { tagId: 2, tagName: '적극적이에요', count: 19 },
  { tagId: 4, tagName: '꼼꼼해요', count: 17 },
  { tagId: 1, tagName: '응답이 빨라요', count: 15 },
  { tagId: 6, tagName: '피드백을 잘 수용해요', count: 14 },
  { tagId: 7, tagName: '문서 정리를 잘 해요', count: 12 },
  { tagId: 8, tagName: '마감을 잘 지켜요', count: 11 },
  { tagId: 10, tagName: '팀 분위기를 좋게 만들어요', count: 9 },
  { tagId: 15, tagName: '문제 해결을 잘 해요', count: 8 },
  { tagId: 11, tagName: '실행력이 좋아요', count: 7 },
  { tagId: 16, tagName: '일정 관리를 잘 해요', count: 6 },
  { tagId: 18, tagName: '고마움을 잘 표현해요', count: 4 },
  { tagId: 20, tagName: '모르는 것을 숨기지 않고 물어봐요', count: 3 },
  { tagId: 19, tagName: '먼저 친근하게 다가와요', count: 2 },
] as const;

const mockProjectReceivedTagCounts = [
  { tagId: 5, tagName: '약속을 잘 지켜요', count: 6 },
  { tagId: 2, tagName: '적극적이에요', count: 5 },
  { tagId: 4, tagName: '꼼꼼해요', count: 4 },
  { tagId: 1, tagName: '응답이 빨라요', count: 3 },
  { tagId: 6, tagName: '피드백을 잘 수용해요', count: 2 },
  { tagId: 7, tagName: '문서 정리를 잘 해요', count: 1 },
] as const;

const mockSpectrums = [
  { spectrumId: 1, leftLabel: '서포트형', rightLabel: '리드형' },
  { spectrumId: 2, leftLabel: '빠른 작업 속도 중시', rightLabel: '천천히 신중한 고민 중시' },
  { spectrumId: 3, leftLabel: '상황별 유연한 대처', rightLabel: '철저한 계획 기반 실행' },
  { spectrumId: 4, leftLabel: '냉철한 결과 지향', rightLabel: '따뜻한 관계 지향' },
];

const mockSpectrumInfo = [
  {
    spectrumAxisId: 1,
    axisName: '1번 항목',
    averageStrength: 2,
    totalCount: 6,
    leftStrengthCount: 5,
    rightStrengthCount: 1,
  },
  {
    spectrumAxisId: 2,
    axisName: '2번 항목',
    averageStrength: 3,
    totalCount: 6,
    leftStrengthCount: 4,
    rightStrengthCount: 2,
  },
  {
    spectrumAxisId: 3,
    axisName: '3번 항목',
    averageStrength: 3,
    totalCount: 6,
    leftStrengthCount: 4,
    rightStrengthCount: 2,
  },
  {
    spectrumAxisId: 4,
    axisName: '4번 항목',
    averageStrength: 6,
    totalCount: 6,
    leftStrengthCount: 0,
    rightStrengthCount: 6,
  },
] as const;

const mockProjectSpectrumInfo = [
  {
    spectrumAxisId: 1,
    axisName: '1번 항목',
    averageStrength: 2,
    totalCount: 2,
    leftStrengthCount: 2,
    rightStrengthCount: 0,
  },
  {
    spectrumAxisId: 2,
    axisName: '2번 항목',
    averageStrength: 3,
    totalCount: 2,
    leftStrengthCount: 1,
    rightStrengthCount: 1,
  },
  {
    spectrumAxisId: 3,
    axisName: '3번 항목',
    averageStrength: 3,
    totalCount: 2,
    leftStrengthCount: 1,
    rightStrengthCount: 1,
  },
  {
    spectrumAxisId: 4,
    axisName: '4번 항목',
    averageStrength: 6,
    totalCount: 2,
    leftStrengthCount: 0,
    rightStrengthCount: 2,
  },
] as const;

export const reviewsHandlers = [
  http.post(`${BASE}/reviews`, () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.get(`${BASE}/form-data`, () => {
    return HttpResponse.json({ tags: mockTags, spectrums: mockSpectrums });
  }),

  http.get(`${BASE}/users/:userId/reviews`, ({ params }) => {
    const isMine = Number(params.userId) === MY_USER_ID;
    const data = mockReceivedReviews.map(({ negativeFeedback, ...rest }) =>
      isMine ? { ...rest, negativeFeedback } : rest,
    );

    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data,
    });
  }),

  http.get(`${BASE}/reviews/tags/:userId`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {
        top3Tags: mockReceivedTagCounts.slice(0, 3),
        allTags: mockReceivedTagCounts,
      },
    });
  }),

  http.get(`${BASE}/reviews/tags/:userId/:projectId`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {
        top3Tags: mockProjectReceivedTagCounts.slice(0, 3),
        allTags: mockProjectReceivedTagCounts,
      },
    });
  }),

  http.get(`${BASE}/reviews/spectrums/:userId`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {
        spectrumInfoResDtos: mockSpectrumInfo,
      },
    });
  }),

  http.get(`${BASE}/reviews/spectrums/:userId/:projectId`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {
        spectrumInfoResDtos: mockProjectSpectrumInfo,
      },
    });
  }),
];
