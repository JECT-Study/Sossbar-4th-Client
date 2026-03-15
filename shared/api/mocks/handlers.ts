import { http, HttpResponse } from 'msw';

import type { GetAuthMeResponse } from '@/shared/api/types/auth';
import type {
  GetProfileMeResponse,
  PostReviewReactionResponse,
  PostReviewRequestResponse,
} from '@/shared/api/types/profile';

const MOCK_PROFILE: GetProfileMeResponse = {
  id: 'user-1',
  nickname: '데모유저',
  reviews: [
    { id: 'review-1', content: '서비스가 만족스러웠어요.', tags: ['친절'], reactionCount: 12, reacted: false },
    { id: 'review-2', content: '두 번째 후기입니다.', tags: ['품질'], reactionCount: 5, reacted: true },
  ],
};

const reactionCounts: Record<string, number> = { 'review-1': 12, 'review-2': 5 };

export const handlers = [
  http.get('/api/profiles/me', () => HttpResponse.json<GetProfileMeResponse>(MOCK_PROFILE)),
  http.get('/api/auth/me', () => HttpResponse.json<GetAuthMeResponse>({ id: 'user-1', nickname: '데모유저' })),
  http.post('/api/review-requests', () =>
    HttpResponse.json<PostReviewRequestResponse>({
      requestId: 'req-1',
      shareUrl: 'https://example.com/share/req-1',
    }),
  ),
  http.post<{ reviewId: string }>('/api/reviews/:reviewId/reaction', ({ params }) => {
    const n = (reactionCounts[params.reviewId] ?? 0) + 1;
    reactionCounts[params.reviewId] = n;
    return HttpResponse.json<PostReviewReactionResponse>({ reacted: true, reactionCount: n });
  }),
];
