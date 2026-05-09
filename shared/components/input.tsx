'use client';

import type { ComponentProps, InputHTMLAttributes, Ref } from 'react';

import { useId, useState } from 'react';

import { DangerIcon, InputClearIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

type InputClearButtonProps = ComponentProps<'button'>;

const InputClearButton = ({ 'aria-label': ariaLabel = '입력 지우기', className, ...props }: InputClearButtonProps) => {
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
      <InputClearIcon className="text-icon-gray pointer-events-none shrink-0 select-none" aria-hidden />
    </button>
  );
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  className?: string;
  inputClassName?: string;
  variant?: 'default' | 'error';
  /** `variant="error"`일 때 하단 안내 문구 */
  errorMessage?: string;
  ref?: Ref<HTMLInputElement>;
};

export const Input = ({
  ref,
  className,
  inputClassName,
  disabled,
  variant = 'default',
  errorMessage,
  'aria-describedby': ariaDescribedBy,
  onChange,
  onFocus,
  onBlur,
  value,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isError = variant === 'error';
  const errorId = useId();
  const resolvedErrorText = errorMessage ?? '메시지를 입력해 주세요';

  const describedBy = [ariaDescribedBy, isError ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  const showClearButton = isFocused && !disabled && typeof value === 'string' && value.length > 0;

  const handleClear = () => {
    onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

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
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            'text-body-base min-w-0 flex-1 bg-transparent py-0 text-start leading-normal outline-none',
            disabled
              ? 'text-text-subtle placeholder:text-text-subtle cursor-not-allowed'
              : 'text-text-basic placeholder:text-text-disabled',
            inputClassName,
          )}
          {...props}
        />

        {!!showClearButton && (
          <span className={cn('flex shrink-0 items-center justify-center', 'text-icon-gray [&_svg]:text-icon-gray')}>
            <InputClearButton onMouseDown={(e) => e.preventDefault()} onClick={handleClear} />
          </span>
        )}
      </div>

      {!!isError && (
        <div id={errorId} className="mt-1 flex w-full items-start gap-1" aria-live="polite">
          <DangerIcon width={16} height={16} className="pointer-events-none mt-0.5 shrink-0" aria-hidden />
          <span className="text-body-sm text-text-error">{resolvedErrorText}</span>
        </div>
      )}
    </div>
  );
};
