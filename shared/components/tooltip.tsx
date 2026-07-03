'use client';

import type { ReactNode } from 'react';

import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

interface Props {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  contentClassName?: string;
}

export const Tooltip = ({ content, children, side = 'bottom', align = 'center', contentClassName }: Props) => (
  <TooltipPrimitive.Provider delayDuration={100}>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          className={cn(
            'bg-surface-inverse text-text-basic-inverse text-body-sm z-50 max-w-[360px] rounded px-3 py-2 font-normal',
            'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
            contentClassName,
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-surface-inverse" width={12} height={6} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);
