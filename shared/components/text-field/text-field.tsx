import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import { ErrorMessage } from '../error-message';
import { Input } from '../input/input';
import { Label } from '../label';

interface Props extends ComponentProps<'input'> {
  name: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
  clearable?: boolean;
}

export const TextField = ({
  label,
  required,
  errorMessage,
  className,
  inputClassName,
  name,
  clearable,
  ...restProps
}: Props) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Label required={required} htmlFor={`input-${name}`}>
        {label}
      </Label>
      <Input
        name={name}
        clearable={clearable}
        id={`input-${name}`}
        aria-describedby={errorMessage ? `${name}-error-message` : undefined}
        placeholder="내용을 입력해주세요."
        className={inputClassName}
        error={!!errorMessage}
        {...restProps}
      />
      {errorMessage ? <ErrorMessage id={`${name}-error-message`}>{errorMessage}</ErrorMessage> : null}
    </div>
  );
};
