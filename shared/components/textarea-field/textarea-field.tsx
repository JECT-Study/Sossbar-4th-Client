'use client';

import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import { Label } from '../label';
import { Textarea } from '../textarea';

interface Props extends ComponentProps<'textarea'> {
  name: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  textareaClassName?: string;
}

export const TextareaField = ({
  name,
  label,
  required,
  errorMessage,
  className,
  textareaClassName,
  disabled,
  maxLength,
  value,
  defaultValue,
  ...restProps
}: Props) => {
  return (
    <div className={cn('relative flex flex-col gap-2', className)}>
      <Label required={required} htmlFor={`textarea-${name}`}>
        {label}
      </Label>
      <div className="flex flex-col gap-2">
        <Textarea
          name={name}
          id={`textarea-${name}`}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-describedby={errorMessage ? `${name}-error-message` : undefined}
          placeholder="내용을 입력해주세요."
          className={textareaClassName}
          variant={errorMessage ? 'error' : 'default'}
          errorMessage={errorMessage}
          {...restProps}
        />
      </div>
    </div>
  );
};
