import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';

import { useTextareaInteraction } from '@/shared/components/textarea/use-textarea-interaction';
import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

import { CharCount } from '../char-count';

const textareaVariants = cva(
  'border border-border-gray rounded-md px-4 pr-9 py-3 text-body-base min-w-0 w-full bg-transparent text-start leading-normal outline-none placeholder:text-text-disabled focus-within:ring-border-primary focus-within:ring-2 focus-within:ring-inset resize-none',
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

interface Props extends ComponentProps<'textarea'>, Omit<VariantProps<typeof textareaVariants>, 'disabled'> {
  name: string;
  wrapperClassName?: string;
}

export const Textarea = ({
  ref,
  name,
  wrapperClassName,
  error,
  disabled,
  className,
  maxLength,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}: Props) => {
  const { mergedRef, valueLength, isFocused, handleChange, handleFocus, handleBlur } = useTextareaInteraction({
    ref,
    onChange,
    onFocus,
    onBlur,
  });

  const showCount = maxLength != null && !disabled;
  const countState = error ? 'error' : isFocused ? 'focused' : valueLength > 0 ? 'filled' : 'idle';

  return (
    <div className={cn('relative flex w-full flex-col', wrapperClassName)}>
      <textarea
        ref={mergedRef}
        name={name}
        className={cn(textareaVariants({ error, disabled }), className)}
        aria-invalid={error || undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={maxLength}
        {...restProps}
      />
      {showCount ? (
        <div className="absolute right-0 bottom-0 translate-y-[calc(100%+8px)]">
          <CharCount current={valueLength} max={maxLength!} state={countState} />
        </div>
      ) : null}
    </div>
  );
};
