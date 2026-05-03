import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

const mockTags = [
  { tagId: 1, name: '꼼꼼해요' },
  { tagId: 2, name: '소통이 잘돼요' },
  { tagId: 3, name: '책임감이 강해요' },
  { tagId: 4, name: '아이디어가 넘쳐요' },
  { tagId: 5, name: '시간 약속을 잘 지켜요' },
  { tagId: 6, name: '피드백을 잘 수용해요' },
  { tagId: 7, name: '문서화를 잘해요' },
  { tagId: 8, name: '끝까지 책임져요' },
  { tagId: 9, name: '배려심이 깊어요' },
  { tagId: 10, name: '주도적으로 이끌어요' },
];

const mockSpectrums = [
  { spectrumId: 1, leftLabel: '신중해요', rightLabel: '추진력 있어요' },
  { spectrumId: 2, leftLabel: '혼자 집중해요', rightLabel: '함께 소통해요' },
  { spectrumId: 3, leftLabel: '계획적이에요', rightLabel: '유연해요' },
];

export const reviewsHandlers = [
  http.post(`${BASE}/reviews`, () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.get(`${BASE}/form-data`, () => {
    return HttpResponse.json({ tags: mockTags, spectrums: mockSpectrums });
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
        spectrums: [{ spectrumId: 1, value: 70 }],
        createdAt: '2026-04-20T00:00:00Z',
      },
    ]);
  }),

  http.get(`${BASE}/reviews/tags`, () => {
    return HttpResponse.json(mockTags);
  }),

  http.get(`${BASE}/reviews/tags/:projectId`, () => {
    return HttpResponse.json(mockTags.slice(0, 5));
  }),

  http.get(`${BASE}/reviews/spectrums`, () => {
    return HttpResponse.json(mockSpectrums.map((s) => ({ ...s, averageValue: 60 })));
  }),

  http.get(`${BASE}/reviews/spectrums/:projectId`, () => {
    return HttpResponse.json(mockSpectrums.map((s) => ({ ...s, averageValue: 55 })));
  }),
];
