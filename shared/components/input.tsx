import type { InputHTMLAttributes, ReactElement } from 'react';

import { forwardRef, useId } from 'react';

import { DeleteIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

const InputErrorLeadIcon = () => {
  return (
    <DeleteIcon
      width={16}
      height={16}
      className="[&_rect]:fill-element-error [&_path]:fill-icon-inverse pointer-events-none mt-0.5 shrink-0"
      aria-hidden
    />
  );
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  leftSlot?: ReactElement;
  rightSlot?: ReactElement;
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
          disabled && 'border-border-gray bg-surface-gray-subtler cursor-not-allowed border',
          !disabled && isError && 'border-border-error bg-surface-white border-2',
          !disabled &&
            !isError && [
              'border-border-gray bg-surface-white border',
              'focus-within:border-transparent',
              'focus-within:bg-surface-white',
              'focus-within:ring-border-primary focus-within:ring-2 focus-within:ring-inset',
            ],
        )}
      >
        {leftSlot != null && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center',
              disabled ? 'text-icon-disabled [&_svg]:text-icon-disabled' : 'text-icon-gray [&_svg]:text-icon-gray',
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
              ? 'text-text-subtle placeholder:text-text-subtle cursor-not-allowed'
              : 'text-text-basic placeholder:text-text-disabled',
            inputClassName,
          )}
          {...props}
        />

        {rightSlot != null && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center',
              disabled ? 'text-icon-disabled [&_svg]:text-icon-disabled' : 'text-icon-gray [&_svg]:text-icon-gray',
            )}
          >
            {rightSlot}
          </span>
        )}
      </div>

      {!!isError && (
        <div id={errorId} className="mt-1 flex w-full items-start gap-1" aria-live="polite">
          <InputErrorLeadIcon />
          <span className="text-body-sm text-text-error">{resolvedErrorText}</span>
        </div>
      )}
    </div>
  );
});
