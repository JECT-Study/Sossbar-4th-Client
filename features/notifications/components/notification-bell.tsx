'use client';

import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { XIcon } from '@/shared/assets/icons';
import { DialogAnimatedPortal } from '@/shared/components/dialog';
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      refetch();
    }
  };

  const triggerClassName = cn(
    'inline-flex size-11 items-center justify-center rounded-lg outline-none lg:size-10',
    'hover:bg-surface-gray-subtler focus-visible:ring-border-primary focus-visible:ring-2',
    className,
  );

  const ariaLabel = unreadCount > 0 ? `알림 ${unreadCount}건` : '알림';

  return (
    <>
      <div className="hidden lg:block">
        <Dropdown.Root onOpenChange={handleOpenChange}>
          <Dropdown.Trigger type="button" className={triggerClassName} aria-label={ariaLabel}>
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
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          className={triggerClassName}
          aria-label={ariaLabel}
          onClick={() => {
            setIsMobileOpen(true);
            refetch();
          }}
        >
          <BellFilled unreadCount={unreadCount} />
        </button>

        <Dialog.Root
          open={isMobileOpen}
          onOpenChange={(open) => {
            setIsMobileOpen(open);
            handleOpenChange(open);
          }}
        >
          <DialogAnimatedPortal
            open={isMobileOpen}
            overlayClassName="z-40 bg-black/70"
            className="bg-surface-white fixed top-1/2 left-1/2 z-40 flex h-dvh w-screen max-w-none flex-col rounded-none border-0 p-0"
          >
            <div className="border-divider-gray-light flex h-[61px] shrink-0 items-center justify-between border-b px-5">
              <Dialog.Title className="text-body-base text-text-basic font-bold">알림함</Dialog.Title>
              <Dialog.Close className="hover:bg-surface-gray-subtler focus-visible:ring-border-primary inline-flex size-11 items-center justify-center rounded-lg outline-none focus-visible:ring-2">
                <XIcon width={24} height={24} />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">알림 목록</Dialog.Description>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <NotificationDropdownContent
                notifications={notifications}
                onMarkAllRead={() => markAllRead.mutate()}
                onSelectNotification={(notificationId) => markRead.mutate(notificationId)}
                className="w-full max-w-none rounded-none border-0 shadow-none"
              />
            </div>
          </DialogAnimatedPortal>
        </Dialog.Root>
      </div>
    </>
  );
};
