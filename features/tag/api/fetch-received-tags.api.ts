import { apiRequest } from '@/shared/lib/api';

import type { ReceivedTags } from '../tag.types';

export const fetchReceivedTags = (userId: number): Promise<ReceivedTags> =>
  apiRequest<ReceivedTags>(`/reviews/tags/${userId}`);
