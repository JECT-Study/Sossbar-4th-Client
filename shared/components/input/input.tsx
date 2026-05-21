'use client';

import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';

import { InputClearIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

import { useInputInteraction } from '../../hooks/use-input-interaction';

const inputVariants = cva(
  'border border-border-gray rounded-md px-4 pr-9 py-3 text-body-base min-w-0 w-full bg-transparent text-start leading-normal outline-none placeholder:text-text-disabled focus-within:ring-border-primary focus-within:ring-2 focus-within:ring-inset',
  {
    variants: {
      error: {
        true: 'border-border-error bg-surface-white border-2',
        false: '',
      },
      disabled: {
        true: 'border-input-border-disabled bg-input-surface-disabled text-text-disabled-on',
        false: '',
      },
    },
    compoundVariants: [
      {
        error: true,
        disabled: true,
        class: 'border',
      },
    ],
    defaultVariants: {
      error: false,
      disabled: false,
    },
  },
);

const countVariants = cva('text-body-sm ml-auto shrink-0 tabular-nums', {
  variants: {
    state: {
      idle: 'text-text-disabled',
      focused: 'text-text-primary',
      filled: 'text-text-success',
      error: 'text-text-error',
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

interface Props extends ComponentProps<'input'>, Omit<VariantProps<typeof inputVariants>, 'disabled'> {
  name: string;
  clearable?: boolean;
  wrapperClassName?: string;
}

export const Input = ({
  ref,
  disabled,
  error,
  className,
  wrapperClassName,
  clearable,
  maxLength,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}: Props) => {
  const { mergedRef, valueLength, isFocused, handleChange, handleFocus, handleBlur, clearInput } = useInputInteraction({
    ref,
    onChange,
    onFocus,
    onBlur,
  });

  const showClearButton = clearable && isFocused && valueLength > 0 && !disabled;
  const showCount = maxLength != null && !disabled;
  const countState = error ? 'error' : isFocused ? 'focused' : valueLength > 0 ? 'filled' : 'idle';

  return (
    <div className={cn('flex w-full flex-col', wrapperClassName)}>
      <div className="relative flex w-full items-center">
        <input
          ref={mergedRef}
          disabled={disabled}
          maxLength={maxLength}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(inputVariants({ disabled, error }), className)}
          aria-invalid={error || undefined}
          {...restProps}
        />
        {showClearButton ? (
          <button
            type="button"
            aria-label="입력 지우기"
            className="absolute top-1/2 right-4 flex h-5 w-5 shrink-0 -translate-y-1/2 items-center justify-center rounded-full p-0 outline-none"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearInput}
            tabIndex={-1}
          >
            <InputClearIcon className="text-icon-gray pointer-events-none shrink-0 select-none" aria-hidden />
          </button>
        ) : null}
      </div>
      {showCount ? (
        <div className="mt-1 flex justify-end">
          <span className={countVariants({ state: countState })}>
            <span>{valueLength}</span>
            <span className="text-text-subtle">/{maxLength}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
};
