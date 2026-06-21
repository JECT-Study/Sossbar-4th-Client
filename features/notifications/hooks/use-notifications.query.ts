import { useQuery } from '@tanstack/react-query';

import { fetchNotifications } from '../api/fetch-notifications';
import { notificationKeys } from '../notification.query-keys';

export const useNotifications = () =>
  useQuery({
    queryKey: notificationKeys.all,
    queryFn: fetchNotifications,
    enabled: false,
    throwOnError: false,
    staleTime: 30_000,
  });
