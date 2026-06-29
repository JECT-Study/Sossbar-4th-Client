'use client';

import type { ReactNode, Ref } from 'react';

import { MultiSelect } from '@/shared/components/multi-select';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { cn } from '@/shared/lib/cn';

import { Label } from '../label';

export type MultiSelectFieldOption = {
  value: string;
  label: ReactNode;
};

interface Props {
  name: string;
  label: string;
  options: readonly MultiSelectFieldOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  required?: boolean;
  placeholder?: string;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export const MultiSelectField = ({
  name,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  required,
  placeholder = '항목을 선택해주세요',
  ref,
  className,
  triggerClassName,
  contentClassName,
}: Props) => {
  const [selectedValue, setSelectedValue] = useControllableState<string[]>({
    prop: value,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
  });

  const selectedOptions = options.filter((option) => selectedValue.includes(option.value));

  return (
    <div className={cn('relative flex flex-col gap-2', className)}>
      <Label htmlFor={`multi-select-${name}`} required={required}>
        {label}
      </Label>
      <MultiSelect.Root value={selectedValue} onValueChange={setSelectedValue}>
        <MultiSelect.Trigger ref={ref} id={`multi-select-${name}`} className={triggerClassName}>
          {selectedOptions.length === 0 ? (
            <span className="text-text-disabled">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <MultiSelect.Tag key={option.value} value={option.value}>
                {option.label}
              </MultiSelect.Tag>
            ))
          )}
        </MultiSelect.Trigger>

        <MultiSelect.Content className={cn('w-(--radix-popover-trigger-width)', contentClassName)}>
          {options.map((option) => (
            <MultiSelect.Item key={option.value} value={option.value}>
              {option.label}
            </MultiSelect.Item>
          ))}
        </MultiSelect.Content>
      </MultiSelect.Root>

      {selectedValue.map((itemValue) => (
        <input key={itemValue} type="hidden" name={name} value={itemValue} />
      ))}
    </div>
  );
};
