import { http, HttpResponse } from 'msw';

import type { Spectrum } from '@/features/review/types/spectrum';

import { markMockReviewSubmitted } from '../lib/submitted-reviews';

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

/** 후기 작성 폼용 축 (spectrumId → POST 시 spectrumAxisId로 매핑) */
const mockReviewFormSpectrums = [
  { spectrumId: 1, leftLabel: '서포트형', rightLabel: '리드형' },
  { spectrumId: 2, leftLabel: '빠른 작업 속도 중시', rightLabel: '천천히 신중한 고민 중시' },
  { spectrumId: 3, leftLabel: '상황별 유연한 대처', rightLabel: '철저한 계획 기반 실행' },
  { spectrumId: 4, leftLabel: '냉철한 결과 지향', rightLabel: '따뜻한 관계 지향' },
] as const satisfies readonly Spectrum[];

const mockSpectrumAxisInfos = [
  { spectrumAxisId: 1, axisName: '서포트형-리드형', averageStrength: 4, leftStrengthCount: 1, rightStrengthCount: 7 },
  { spectrumAxisId: 2, axisName: '작업속도', averageStrength: 2, leftStrengthCount: 5, rightStrengthCount: 1 },
  { spectrumAxisId: 3, axisName: '대처방식', averageStrength: 3, leftStrengthCount: 4, rightStrengthCount: 2 },
  { spectrumAxisId: 4, axisName: '관계지향', averageStrength: 4, leftStrengthCount: 0, rightStrengthCount: 6 },
];

const mockSpectrumInfo = { totalCount: 8, spectrumInfoResDtos: mockSpectrumAxisInfos };

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
      markMockReviewSubmitted(projectId, revieweeId);
    }

    return new HttpResponse(null, { status: 201 });
  }),

  http.get(`${BASE}/form-data`, () => {
    return HttpResponse.json({ tags: mockTags, spectrums: [...mockReviewFormSpectrums] });
  }),

  http.get(`${BASE}/users/:userId/reviews`, () => {
    return HttpResponse.json([
      {
        reviewId: 1,
        projectName: '소스바 프로젝트',
        host: 'JECT',
        projectImage: null,
        createdAt: '2026-04-20T00:00:00',
        positiveFeedback: '소통이 잘 되고 매우 꼼꼼하게 작업해주셨습니다.',
        negativeFeedback: '일정 관리를 좀 더 세밀하게 하면 좋을 것 같아요.',
        reviewerNickname: '익명의 동료',
      },
      {
        reviewId: 2,
        projectName: '2025 해커톤 프로젝트',
        host: '테크 스타트업',
        projectImage: null,
        createdAt: '2025-07-10T00:00:00',
        positiveFeedback: '항상 책임감 있게 작업을 수행해주시고 협업 분위기도 좋게 이끌어주셨습니다.',
        negativeFeedback: '진행 상황 공유가 조금 더 빨라지면 협업 흐름을 맞추는 데 도움이 될 것 같습니다.',
        reviewerNickname: '익명의 동료',
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
    return HttpResponse.json(mockSpectrumInfo);
  }),

  http.get(`${BASE}/reviews/spectrums/:userId/:projectId`, () => {
    return HttpResponse.json(mockSpectrumInfo);
  }),
];
