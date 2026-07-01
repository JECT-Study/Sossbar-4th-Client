import { apiRequest } from '@/shared/lib/api';

import type { ReceivedTags } from './tag.types';

export const fetchReceivedTags = (userLink: string): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userLink}`);

export const fetchReceivedTagsByProject = (userLink: string, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userLink}/${projectId}`);
