import { apiRequest } from '@/shared/lib/api';

import type { ReceivedTags } from './tag.types';

export const tagKeys = {
  all: ['tag'] as const,
  received: (userLink: string, projectId?: number) => [...tagKeys.all, 'received', userLink, projectId] as const,
};

/** GET /api/v1/reviews/tags/{userLink} 받은 태그 전체 조회 */
export const fetchReceivedTags = (userLink: string): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userLink}`);

/** GET /api/v1/reviews/tags/{userLink}/{projectId} 받은 태그 프로젝트별 조회 */
export const fetchReceivedTagsByProject = (userLink: string, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userLink}/${projectId}`);
