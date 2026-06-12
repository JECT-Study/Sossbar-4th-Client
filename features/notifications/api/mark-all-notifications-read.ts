import { apiRequest } from '@/shared/lib/api';

export const markAllNotificationsRead = (): Promise<void> =>
  apiRequest<void>('/notifications/read/all', { method: 'PATCH' });
