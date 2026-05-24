import type { Ref, TextareaHTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';
import { useId, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { parseCounterText } from '@/shared/lib/parse-counter-text';

const counterColorVariants = cva('', {
  variants: {
    inputState: {
      disabled: 'text-text-subtle',
      error: 'text-(--color-border-error)',
      success: 'text-text-success',
      completed: 'text-input-border',
      focused: 'text-(--color-border-primary)',
      idle: 'text-text-disabled',
    },
  },
  defaultVariants: { inputState: 'idle' as const },
});

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  className?: string;
  textareaClassName?: string;
  variant?: 'default' | 'error';
  isCompleted?: boolean;
  label?: string;
  bottomText?: string;
  currentCount?: number;
  totalCount?: number;
  errorMessage?: string;
  counterSuccessMin?: number;
  counterSuccessCompareCount?: number;
}

export const Textarea = ({
  ref,
  className,
  textareaClassName,
  disabled,
  variant = 'default',
  isCompleted = false,
  label,
  bottomText,
  currentCount,
  totalCount,
  errorMessage,
  counterSuccessMin,
  counterSuccessCompareCount,
  id,
  placeholder = '내용을 입력해주세요',
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
  ...props
}: Props) => {
  // IDs
  const generatedId = useId();
  const textareaId = id ?? `textarea-${generatedId}`;
  const helperId = `${textareaId}-helper`;

  // State
  const [isFocused, setIsFocused] = useState(false);

  // Derived state
  const isError = variant === 'error';
  const resolvedCounter =
    currentCount != null && totalCount != null ? { currentCount, totalCount } : parseCounterText(bottomText);

  // Helper 영역 노출 조건
  const hasErrorMessage = isError && !!errorMessage?.trim();
  const hasCounter = resolvedCounter != null;
  const hasHelper = hasErrorMessage || hasCounter || bottomText != null;

  const countMeetsSuccessMin =
    counterSuccessMin != null &&
    resolvedCounter != null &&
    (counterSuccessCompareCount ?? resolvedCounter.currentCount) >= counterSuccessMin;

  const inputState = disabled
    ? 'disabled'
    : isError
      ? 'error'
      : isFocused
        ? 'focused'
        : countMeetsSuccessMin
          ? 'success'
          : isCompleted
            ? 'completed'
            : 'idle';
  const counterColorCls = counterColorVariants({ inputState });

  const describedBy = [ariaDescribedBy, hasHelper ? helperId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex w-full max-w-[360px] flex-col', className)}>
      {label != null && (
        <label htmlFor={textareaId} className="text-body-base text-text-subtle mb-2 font-bold">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        aria-invalid={isError || undefined}
        aria-describedby={describedBy}
        placeholder={placeholder}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        className={cn(
          'text-body-base border-input-border h-36 w-full resize-none rounded-md border px-4 py-2 text-start leading-normal outline-none',
          'transition-[border-color,box-shadow,background-color]',
          disabled &&
            'border-input-border-disabled bg-surface-gray-subtler text-text-subtle placeholder:text-text-subtle cursor-not-allowed',
          !disabled && isError && 'border-input-border-error bg-surface-white',
          !disabled &&
            !isError &&
            !isCompleted && [
              'bg-surface-white',
              'focus:border-transparent',
              'focus:bg-surface-white',
              'focus:ring-border-primary focus:ring-2 focus:ring-inset',
            ],
          !disabled &&
            !isError &&
            isCompleted && [
              'bg-surface-white',
              'focus:border-transparent',
              'focus:bg-surface-white',
              'focus:ring-border-primary focus:ring-2 focus:ring-inset',
            ],
          !disabled && 'text-text-basic placeholder:text-text-disabled',
          textareaClassName,
        )}
        {...props}
      />

      {!!hasHelper &&
        (isError ? (
          <div id={helperId} className="mt-2 flex w-full items-start justify-between gap-2">
            {!!hasErrorMessage && <p className="text-body-sm text-text-error">{errorMessage}</p>}
            {!!hasCounter && (
              <p className="text-body-sm ml-auto text-right whitespace-nowrap">
                <span className={cn(counterColorCls, 'mr-[2px]')}>{resolvedCounter.currentCount}</span>
                <span className="text-text-subtle">/{resolvedCounter.totalCount}</span>
              </p>
            )}
          </div>
        ) : hasCounter ? (
          <p id={helperId} className="text-body-sm mt-2 flex w-full justify-end text-right">
            <span className={cn(counterColorCls, 'mr-[2px]')}>{resolvedCounter.currentCount}</span>
            <span className="text-text-subtle">/{resolvedCounter.totalCount}</span>
          </p>
        ) : (
          <p id={helperId} className="text-body-sm text-text-subtle mt-2">
            {bottomText}
          </p>
        ))}
    </div>
  );
};
