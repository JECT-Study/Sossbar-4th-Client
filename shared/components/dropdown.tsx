'use client';

import type { ComponentPropsWithRef } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { DropdownMenu } from 'radix-ui';
import { createContext, useContext, useState } from 'react';

import { cn } from '@/shared/lib/cn';

const DROPDOWN_CONTENT_DURATION_S = 0.25;
const DROPDOWN_CONTENT_EASE = [0.16, 1, 0.3, 1] as const;
const DROPDOWN_CONTENT_SCALE = 0.96;

const DropdownOpenContext = createContext(false);

const DropdownRoot = ({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...restProps
}: ComponentPropsWithRef<typeof DropdownMenu.Root>) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <DropdownOpenContext.Provider value={open}>
      <DropdownMenu.Root open={open} onOpenChange={handleOpenChange} {...restProps} />
    </DropdownOpenContext.Provider>
  );
};

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
  const open = useContext(DropdownOpenContext);
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {!!open && (
        <DropdownMenu.Portal forceMount>
          <DropdownMenu.Content
            side="bottom"
            align={align}
            sideOffset={sideOffset ?? 8}
            forceMount
            className="z-50 outline-none"
            {...restProps}
          >
            <motion.div
              className={cn(
                'border-border-gray-light bg-surface-white box-border flex w-44 flex-col rounded-lg border p-2 shadow-sm',
                className,
              )}
              style={{ transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)' }}
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : DROPDOWN_CONTENT_SCALE }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : DROPDOWN_CONTENT_SCALE }}
              transition={{
                duration: shouldReduceMotion ? 0 : DROPDOWN_CONTENT_DURATION_S,
                ease: DROPDOWN_CONTENT_EASE,
              }}
            >
              {children}
            </motion.div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      )}
    </AnimatePresence>
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
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
};
