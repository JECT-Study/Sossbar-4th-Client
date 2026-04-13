'use client';

import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

export type InputClearButtonProps = ComponentProps<'button'>;

export const InputClearButton = ({
  'aria-label': ariaLabel = '입력 지우기',
  className,
  ...props
}: InputClearButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 outline-none',
        'focus-visible:ring-1 focus-visible:ring-(--color-border-primary)',
        'disabled:opacity-50',
        'transition-opacity',
        className,
      )}
      {...props}
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        className="text-icon-gray pointer-events-none shrink-0 select-none"
        aria-hidden
      >
        <circle cx="10" cy="10" r="10" className="fill-icon-gray-fill" />
        <line x1="6.25" y1="6.25" x2="13.75" y2="13.75" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1="13.75" y1="6.25" x2="6.25" y2="13.75" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    </button>
  );
};
