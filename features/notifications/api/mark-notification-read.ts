import { apiRequest } from '@/shared/lib/api';

export const markNotificationRead = (notificationId: number): Promise<void> =>
  apiRequest<void>(`/notifications/read/${notificationId}`, { method: 'PATCH' });
