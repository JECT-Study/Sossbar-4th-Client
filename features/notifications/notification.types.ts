export type NotificationType = 'PROJECT_JOINED' | 'TEAM_COMPLETED';

export type NotificationItem = {
  notificationId: number;
  notificationType: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};
