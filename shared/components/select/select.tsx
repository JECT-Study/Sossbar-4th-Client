'use client';

import type { ComponentPropsWithRef } from 'react';

import { Select as SelectPrimitive } from 'radix-ui';

import { DropdownIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

const SelectTrigger = ({
  children,
  className,
  ...restProps
}: ComponentPropsWithRef<typeof SelectPrimitive.Trigger>) => {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'border-input-border bg-input-surface text-body-sm [&[data-placeholder]_[data-slot=select-value]]:text-text-disabled flex h-11.25 w-full items-center justify-between rounded-md border px-4 py-3 outline-none',
        className,
      )}
      {...restProps}
    >
      {children}
      <DropdownIcon aria-hidden className="text-input-border size-5" />
    </SelectPrimitive.Trigger>
  );
};

const SelectValue = ({ className, ...restProps }: ComponentPropsWithRef<typeof SelectPrimitive.Value>) => {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('text-body-sm text-text-basic font-normal', className)}
      {...restProps}
    />
  );
};

const SelectContent = ({
  children,
  className,
  ...restProps
}: ComponentPropsWithRef<typeof SelectPrimitive.Content>) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={4}
        className={cn('bg-input-surface z-50 flex flex-col overflow-hidden rounded-md shadow-lg', className)}
        {...restProps}
      >
        <SelectPrimitive.Viewport className="flex flex-col">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

const SelectItem = ({ children, className, ...restProps }: ComponentPropsWithRef<typeof SelectPrimitive.Item>) => {
  return (
    <SelectPrimitive.Item
      className={cn(
        'text-body-sm text-text-basic hover:bg-action-gray-light data-[state=checked]:bg-action-secondary-selected flex h-12 cursor-pointer items-center px-4 text-left font-medium outline-none',
        'data-disabled:text-text-disabled data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent',
        className,
      )}
      {...restProps}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

export const Select = {
  Root: SelectPrimitive.Root,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
};
