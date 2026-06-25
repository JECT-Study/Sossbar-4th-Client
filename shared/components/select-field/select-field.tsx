'use client';

import type { FocusEventHandler, ReactNode, Ref } from 'react';

import { Select } from '@/shared/components/select/select';
import { cn } from '@/shared/lib/cn';

import { Label } from '../label';

export type SelectFieldOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

interface Props {
  name: string;
  label: string;
  options: readonly SelectFieldOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLButtonElement>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export const SelectField = ({
  name,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  onBlur,
  ref,
  placeholder,
  disabled,
  className,
  triggerClassName,
  contentClassName,
}: Props) => {
  return (
    <div className={cn('relative flex flex-col gap-2', className)}>
      <Label htmlFor={`select-${name}`}>{label}</Label>
      <Select.Root
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <Select.Trigger ref={ref} id={`select-${name}`} onBlur={onBlur} className={triggerClassName}>
          <Select.Value placeholder={placeholder} />
        </Select.Trigger>

        <Select.Content className={cn('w-(--radix-select-trigger-width)', contentClassName)}>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};
