import { apiRequest } from '@/shared/lib/api';

import type { NotificationItem } from './notification.types';

export const fetchNotifications = (): Promise<NotificationItem[]> =>
  apiRequest<NotificationItem[]>('/notifications/all');

export const markAllNotificationsRead = (): Promise<void> =>
  apiRequest<void>('/notifications/read/all', { method: 'PATCH' });

export const markNotificationRead = (notificationId: number): Promise<void> =>
  apiRequest<void>(`/notifications/read/${notificationId}`, { method: 'PATCH' });
