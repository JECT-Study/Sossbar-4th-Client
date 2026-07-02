'use client';

import { Dropdown } from '@/shared/components/dropdown';
import { cn } from '@/shared/lib/cn';

import { BellFilled } from './bell-filled';
import { NotificationDropdownContent } from './notification-dropdown-content';
import { useNotificationActions, useNotifications, useUnreadCount } from '../notification.hooks';

type NotificationBellProps = {
  className?: string;
};

export const NotificationBell = ({ className }: NotificationBellProps) => {
  const { data: notifications = [], refetch } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { markAllRead, markRead } = useNotificationActions();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      refetch();
    }
  };

  return (
    <Dropdown.Root onOpenChange={handleOpenChange}>
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
