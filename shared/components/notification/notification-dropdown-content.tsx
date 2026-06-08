import type { NotificationItem as NotificationItemType } from '@/features/notifications';
import { cn } from '@/shared/lib/cn';

import { NotificationItem } from './notification-item';

type NotificationDropdownContentProps = {
  notifications: NotificationItemType[];
  onMarkAllRead?: () => void;
  onSelectNotification?: (notificationId: number) => void;
  className?: string;
};

export const NotificationDropdownContent = ({
  notifications,
  onMarkAllRead,
  onSelectNotification,
  className,
}: NotificationDropdownContentProps) => {
  const hasUnread = notifications.some((item) => !item.isRead);
  const isEmpty = notifications.length === 0;

  if (isEmpty) {
    return (
      <div
        className={cn(
          'border-border-gray-light bg-surface-white flex w-[360px] flex-col items-center rounded-xl border px-6 py-12',
          className,
        )}
      >
        <p className="text-body-sm text-text-subtle font-medium">새 알림이 없어요</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-border-gray-light bg-surface-white flex w-[360px] flex-col overflow-hidden rounded-xl border shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <p className="text-detail-base text-text-basic leading-normal font-bold">알림</p>
        {hasUnread ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-detail-xs text-text-primary leading-normal font-medium hover:underline"
          >
            모두 읽음
          </button>
        ) : (
          <span className="text-detail-xs text-text-disabled leading-normal font-medium">모두 읽음</span>
        )}
      </div>

      <div className="flex max-h-[min(320px,60vh)] flex-col overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.notificationId}
            notification={notification}
            onSelect={onSelectNotification}
          />
        ))}
      </div>

      <div className="bg-divider-gray-light h-px w-full shrink-0" aria-hidden />
    </div>
  );
};
