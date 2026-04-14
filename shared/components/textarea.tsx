import type { TextareaHTMLAttributes } from 'react';

import { forwardRef, useId, useState } from 'react';

import { cn } from '@/shared/lib/cn';

/** `bottomText`가 "숫자/숫자" 형태일 때 카운터로 파싱 */
const resolveCounterFromBottomText = (bottomText?: string) => {
  if (bottomText == null) {
    return null;
  }

  const normalized = bottomText.replace(/\s+/g, '');
  const matched = /^(\d+)\/(\d+)$/.exec(normalized);
  if (matched == null) {
    return null;
  }

  return {
    currentCount: Number(matched[1]),
    totalCount: Number(matched[2]),
  };
};

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  textareaClassName?: string;
  variant?: 'default' | 'error';
  isCompleted?: boolean;
  /** 텍스트영역 상단 라벨 */
  label?: string;
  bottomText?: string;
  currentCount?: number;
  totalCount?: number;
  errorMessage?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
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
    id,
    'aria-describedby': ariaDescribedBy,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? `textarea-${generatedId}`;
  const helperId = `${textareaId}-helper`;
  const isError = variant === 'error';
  const hasErrorMessage = isError && !!errorMessage?.trim();
  const [isFocused, setIsFocused] = useState(false);
  const resolvedCounter =
    currentCount != null && totalCount != null
      ? { currentCount, totalCount }
      : resolveCounterFromBottomText(bottomText);
  const helperText = isError ? errorMessage : bottomText;
  const hasCounter = resolvedCounter != null;
  const hasHelper = hasErrorMessage || resolvedCounter != null || bottomText != null;
  const resolvedPlaceholder = props.placeholder ?? '내용을 입력해주세요';
  const counterColorCls = disabled
    ? 'text-text-subtle'
    : isError
      ? 'text-(--color-border-error)'
      : isCompleted
        ? 'text-input-border'
        : isFocused
          ? 'text-(--color-border-primary)'
          : 'text-text-disabled';

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
        placeholder={resolvedPlaceholder}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        className={cn(
          'text-body-base h-36 w-full resize-none rounded-md border px-4 py-2 text-start leading-normal outline-none',
          'transition-[border-color,box-shadow,background-color]',
          disabled &&
            'border-border-gray bg-surface-gray-subtler text-text-subtle placeholder:text-text-subtle cursor-not-allowed',
          !disabled && isError && 'border-border-error bg-surface-white border-2',
          !disabled &&
            !isError &&
            !isCompleted && [
              'border-border-gray bg-surface-white',
              'focus:border-transparent',
              'focus:bg-surface-white',
              'focus:ring-border-primary focus:ring-2 focus:ring-inset',
            ],
          !disabled &&
            !isError &&
            isCompleted && [
              'border-input-border bg-surface-white',
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
        ) : resolvedCounter != null ? (
          <p id={helperId} className="text-body-sm mt-2 flex w-full justify-end text-right">
            <span className={cn(counterColorCls, 'mr-[2px]')}>{resolvedCounter.currentCount}</span>
            <span className="text-text-subtle">/{resolvedCounter.totalCount}</span>
          </p>
        ) : (
          <p id={helperId} className="text-body-sm text-text-subtle mt-2">
            {helperText}
          </p>
        ))}
    </div>
  );
});
