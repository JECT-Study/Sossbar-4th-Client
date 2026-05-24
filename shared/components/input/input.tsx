'use client';

import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';

import { InputClearIcon } from '@/shared/assets/icons';
import { useInputInteraction } from '@/shared/components/input/use-input-interaction';
import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

import { CharCount } from '../char-count';

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

interface Props extends ComponentProps<'input'>, Omit<VariantProps<typeof inputVariants>, 'disabled'> {
  name: string;
  clearable?: boolean;
  wrapperClassName?: string;
}

export const Input = ({
  ref,
  disabled,
  readOnly,
  error,
  className,
  wrapperClassName,
  clearable,
  maxLength,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}: Props) => {
  const { mergedRef, valueLength, isFocused, handleChange, handleFocus, handleBlur, clearInput } = useInputInteraction({
    ref,
    defaultValue: defaultValue as string | undefined,
    onChange,
    onFocus,
    onBlur,
  });

  const showClearButton = clearable && isFocused && valueLength > 0 && !disabled && !readOnly;
  const showCount = maxLength != null && !disabled;
  const countState = error ? 'error' : isFocused ? 'focused' : valueLength > 0 ? 'filled' : 'idle';

  return (
    <div className={cn('relative flex w-full flex-col gap-2', wrapperClassName)}>
      <div className="relative flex w-full items-center">
        <input
          ref={mergedRef}
          disabled={disabled}
          readOnly={readOnly}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(inputVariants({ disabled: disabled || readOnly, error }), className)}
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
      {showCount ? <CharCount current={valueLength} max={maxLength!} state={countState} /> : null}
    </div>
  );
};
