import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { NotificationItem } from '../notification.types';

import { markAllNotificationsRead } from '../api/mark-all-notifications-read';
import { markNotificationRead } from '../api/mark-notification-read';
import { notificationKeys } from '../notification.query-keys';

export const useNotificationActions = () => {
  const queryClient = useQueryClient();

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previous = queryClient.getQueryData<NotificationItem[]>(notificationKeys.all);
      queryClient.setQueryData<NotificationItem[]>(
        notificationKeys.all,
        (current) => current?.map((item) => ({ ...item, isRead: true })) ?? [],
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previous = queryClient.getQueryData<NotificationItem[]>(notificationKeys.all);
      queryClient.setQueryData<NotificationItem[]>(
        notificationKeys.all,
        (current) =>
          current?.map((item) => (item.notificationId === notificationId ? { ...item, isRead: true } : item)) ?? [],
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  return { markAllRead, markRead };
};
