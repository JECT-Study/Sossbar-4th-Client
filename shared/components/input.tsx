'use client';

import type { ChangeEvent, ComponentProps, InputHTMLAttributes, Ref } from 'react';

import { useCallback, useId, useRef, useState } from 'react';

import { DangerIcon, InputClearIcon } from '@/shared/assets/icons';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { cn } from '@/shared/lib/cn';

type InputClearButtonProps = ComponentProps<'button'>;

const InputClearButton = ({ 'aria-label': ariaLabel = '입력 지우기', className, ...props }: InputClearButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 outline-none', className)}
      {...props}
    >
      <InputClearIcon className="text-icon-gray pointer-events-none shrink-0 select-none" aria-hidden />
    </button>
  );
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  variant?: 'default' | 'error';
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
  maxLength,
  defaultValue,
  readOnly,
  'aria-describedby': ariaDescribedBy,
  onChange,
  onFocus,
  onBlur,
  value,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isControlled = value !== undefined;

  const [trackedValue, setTrackedValue] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue ?? '',
  });

  // 외부 ref(RHF register 등)와 clear 버튼용 내부 inputRef를 동시에 채우기 위한 콜백 ref
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const isError = variant === 'error';
  const errorId = useId();
  const resolvedErrorText = errorMessage ?? '입력값을 확인해 주세요';

  const describedBy = [ariaDescribedBy, isError ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  const valueLength = trackedValue.length;
  const showCount = maxLength != null && !disabled;
  const showClearButton = isFocused && !disabled && !readOnly && valueLength > 0;

  const countColorClass = isError
    ? 'text-text-error'
    : isFocused
      ? 'text-text-primary'
      : valueLength > 0
        ? 'text-text-success'
        : 'text-text-disabled';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTrackedValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    // React의 value 추적을 우회해 진짜 input 이벤트를 발사해야 onChange가 정상 발화됨
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    nativeSetter?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <div className={cn('flex w-full flex-col', className)}>
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
          fieldClassName,
        )}
      >
        <input
          ref={setInputRef}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
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
          readOnly={readOnly}
          maxLength={maxLength}
          {...(isControlled ? { value } : { defaultValue })}
        />

        {!!showClearButton && (
          <InputClearButton onMouseDown={(e) => e.preventDefault()} onClick={handleClear} tabIndex={-1} />
        )}
      </div>

      {!!(isError || showCount) && (
        <div className="mt-1 flex w-full items-start gap-1">
          {!!isError && (
            <div id={errorId} className="flex items-start gap-1" aria-live="polite">
              <DangerIcon width={16} height={16} className="pointer-events-none mt-0.5 shrink-0" aria-hidden />
              <span className="text-body-sm text-text-error">{resolvedErrorText}</span>
            </div>
          )}
          {!!showCount && (
            <span className={cn('text-body-sm ml-auto shrink-0 tabular-nums', countColorClass)}>
              <span>{valueLength}</span>
              <span className="text-text-subtle">/{maxLength}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
