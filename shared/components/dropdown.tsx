'use client';

import type { ComponentPropsWithRef } from 'react';

import { DropdownMenu } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

const DropdownTrigger = ({ children, className, ...restProps }: ComponentPropsWithRef<typeof DropdownMenu.Trigger>) => {
  return (
    <DropdownMenu.Trigger className={cn('outline-none', className)} {...restProps}>
      {children}
    </DropdownMenu.Trigger>
  );
};

const DropdownContent = ({
  children,
  className,
  align,
  sideOffset,
  ...restProps
}: ComponentPropsWithRef<typeof DropdownMenu.Content>) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        side="bottom"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-surface-white border-border-gray-light z-50 flex w-44 flex-col rounded-lg border p-2',
          className,
        )}
        {...restProps}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};

const DropdownItem = ({ children, className, ...restProps }: ComponentPropsWithRef<typeof DropdownMenu.Item>) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'text-body-base bg-action-secondary hover:bg-action-secondary-hover focus:bg-action-secondary-hover active:bg-action-secondary-pressed text-text-basic flex h-12 w-full cursor-pointer items-center justify-between rounded-md px-4 hover:outline-none',
        className,
      )}
      {...restProps}
    >
      {children}
    </DropdownMenu.Item>
  );
};

export const Dropdown = {
  Root: DropdownMenu.Root,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
};
