import type { InputHTMLAttributes, ReactNode } from 'react';

import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  leftSlot?: ReactNode;
  className?: string;
  inputClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, inputClassName, leftSlot, disabled, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        'box-border flex h-12 w-full max-w-[360px] items-center gap-2 rounded-md px-4',
        'border border-(--color-border-gray) bg-(--color-surface-white)',
        'transition-[border-color,box-shadow,background-color]',
        'focus-within:border-transparent focus-within:bg-(--color-surface-gray-subtler)',
        'focus-within:ring-2 focus-within:ring-(--color-border-primary) focus-within:ring-inset',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      {leftSlot != null && (
        <span className="flex shrink-0 items-center justify-center text-(--color-icon-gray) [&_svg]:text-(--color-icon-gray)">
          {leftSlot}
        </span>
      )}

      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          'text-body-base min-w-0 flex-1 bg-transparent py-0 text-(--color-text-basic) outline-none placeholder:text-(--color-text-disabled) disabled:cursor-not-allowed',
          inputClassName,
        )}
        {...props}
      />
    </div>
  );
});
