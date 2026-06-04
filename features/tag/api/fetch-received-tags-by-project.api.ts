import { apiRequest } from '@/shared/lib/api';

import type { ReceivedTags } from '../tag.types';

export const fetchReceivedTagsByProject = (userId: number, projectId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}/${projectId}`);
