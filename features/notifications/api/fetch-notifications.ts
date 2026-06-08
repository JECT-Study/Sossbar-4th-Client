import { apiRequest } from '@/shared/lib/api';

import type { NotificationItem } from '../notification.types';

export const fetchNotifications = (): Promise<NotificationItem[]> =>
  apiRequest<NotificationItem[]>('/notifications/all');
