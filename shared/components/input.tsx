import type { InputHTMLAttributes, ReactNode } from 'react';

import { forwardRef, useId } from 'react';

import { cn } from '@/shared/lib/cn';

/** KRDS input_message(error): 아이콘 + 텍스트 */
const InputErrorLeadIcon = () => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      className="pointer-events-none mt-0.5 shrink-0 text-(--color-icon-inverse)"
      aria-hidden
    >
      <circle cx={8} cy={8} r={8} className="fill-(--color-element-error)" />
      <line x1="5" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <line x1="11" y1="5" x2="5" y2="11" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  leftSlot?: ReactNode;
  /** 삭제(clear) 등 — 박스 안 오른쪽 */
  rightSlot?: ReactNode;
  className?: string;
  inputClassName?: string;
  variant?: 'default' | 'error';
  /** `variant="error"`일 때 하단 안내 문구 */
  errorMessage?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    inputClassName,
    leftSlot,
    rightSlot,
    disabled,
    variant = 'default',
    errorMessage,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref,
) {
  const isError = variant === 'error';
  const errorId = useId();
  const resolvedErrorText = errorMessage ?? '메시지를 입력해 주세요';

  const describedBy = [ariaDescribedBy, isError ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex w-full max-w-[360px] flex-col', className)}>
      <div
        className={cn(
          'box-border flex h-12 w-full items-center gap-2 rounded-md px-4 py-0',
          'transition-[border-color,box-shadow,background-color]',
          disabled && 'cursor-not-allowed border border-(--color-border-gray) bg-(--color-surface-gray-subtler)',
          !disabled && isError && 'border-2 border-(--color-border-error) bg-(--color-surface-white)',
          !disabled &&
            !isError && [
              'border border-(--color-border-gray) bg-(--color-surface-white)',
              'focus-within:border-transparent',
              'focus-within:bg-(--color-surface-white)',
              'focus-within:ring-2 focus-within:ring-(--color-border-primary) focus-within:ring-inset',
            ],
        )}
      >
        {leftSlot != null && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center',
              disabled
                ? 'text-(--color-icon-disabled) [&_svg]:text-(--color-icon-disabled)'
                : 'text-(--color-icon-gray) [&_svg]:text-(--color-icon-gray)',
            )}
          >
            {leftSlot}
          </span>
        )}

        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          className={cn(
            'text-body-base min-w-0 flex-1 bg-transparent py-0 text-start leading-normal outline-none',
            disabled
              ? 'cursor-not-allowed text-(--color-text-subtle) placeholder:text-(--color-text-subtle)'
              : 'text-(--color-text-basic) placeholder:text-(--color-text-disabled)',
            inputClassName,
          )}
          {...props}
        />

        {rightSlot != null && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center',
              disabled
                ? 'text-(--color-icon-disabled) [&_svg]:text-(--color-icon-disabled)'
                : 'text-(--color-icon-gray) [&_svg]:text-(--color-icon-gray)',
            )}
          >
            {rightSlot}
          </span>
        )}
      </div>

      {!!isError && (
        <div id={errorId} className="mt-1 flex w-full items-start gap-1" aria-live="polite">
          <InputErrorLeadIcon />
          <span className="text-body-sm text-(--color-text-error)">{resolvedErrorText}</span>
        </div>
      )}
    </div>
  );
});
