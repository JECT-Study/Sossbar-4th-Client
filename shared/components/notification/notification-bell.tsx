'use client';

import { useMemo } from 'react';

import { useNotificationActions, useNotifications } from '@/features/notifications';
import { cn } from '@/shared/lib/cn';

import { Dropdown } from '../dropdown';
import { BellFilled } from './bell-filled';
import { NotificationDropdownContent } from './notification-dropdown-content';

type NotificationBellProps = {
  className?: string;
};

export const NotificationBell = ({ className }: NotificationBellProps) => {
  const { data: notifications = [] } = useNotifications();
  const { markAllRead, markRead } = useNotificationActions();

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        type="button"
        className={cn(
          'inline-flex size-10 items-center justify-center rounded-lg outline-none',
          'hover:bg-surface-gray-subtler focus-visible:ring-border-primary focus-visible:ring-2',
          className,
        )}
        aria-label={unreadCount > 0 ? `알림 ${unreadCount}건` : '알림'}
      >
        <BellFilled unreadCount={unreadCount} />
      </Dropdown.Trigger>
      <Dropdown.Content
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="border-0 bg-transparent p-0 shadow-none"
      >
        <NotificationDropdownContent
          notifications={notifications}
          onMarkAllRead={() => markAllRead.mutate()}
          onSelectNotification={(notificationId) => markRead.mutate(notificationId)}
        />
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
