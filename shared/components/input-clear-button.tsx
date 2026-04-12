'use client';

import type { MouseEventHandler } from 'react';

import { cn } from '@/shared/lib/cn';

export type InputClearButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  /** 기본: 입력 지우기 */
  'aria-label'?: string;
  className?: string;
};

/** 20×20 — 연한 원 + 진한 X */
export const InputClearButton = ({
  onClick,
  disabled,
  'aria-label': ariaLabel = '입력 지우기',
  className,
}: InputClearButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 outline-none',
        'focus-visible:ring-1 focus-visible:ring-(--color-border-primary)',
        'disabled:opacity-50',
        'transition-opacity',
        className,
      )}
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        className="pointer-events-none shrink-0 text-(--color-icon-gray) select-none"
        aria-hidden
      >
        <circle cx="10" cy="10" r="10" className="fill-(--color-icon-gray-fill)" />
        <line x1="6.25" y1="6.25" x2="13.75" y2="13.75" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <line x1="13.75" y1="6.25" x2="6.25" y2="13.75" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    </button>
  );
};
