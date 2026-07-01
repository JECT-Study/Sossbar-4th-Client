import { cn } from '@/shared/lib/cn';

import type { NotificationItem as NotificationItemType } from '../notification.types';

import { formatRelativeTime } from '../notification.lib';

type NotificationItemProps = {
  notification: NotificationItemType;
  onSelect?: (notificationId: number) => void;
  className?: string;
};

export const NotificationItem = ({ notification, onSelect, className }: NotificationItemProps) => {
  const { notificationId, title, description, isRead, createdAt } = notification;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(notificationId)}
      className={cn(
        'hover:bg-action-secondary-hover focus-visible:bg-action-secondary-hover relative flex min-h-[89px] w-full shrink-0 items-start px-4 py-3 text-left outline-none',
        className,
      )}
    >
      {!isRead ? (
        <span className="bg-element-primary absolute top-[18px] left-4 size-2 shrink-0 rounded-full" aria-hidden />
      ) : null}
      <span className="flex min-w-0 flex-col gap-1 pl-5">
        <span className="text-body-sm text-text-basic leading-normal font-medium">{title}</span>
        <span className="text-body-sm text-text-subtle leading-normal font-normal">{description}</span>
        <span className="text-detail-xs text-text-subtler leading-normal font-normal">
          {formatRelativeTime(createdAt)}
        </span>
      </span>
    </button>
  );
};
