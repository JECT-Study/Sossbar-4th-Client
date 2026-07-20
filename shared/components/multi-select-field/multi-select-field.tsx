'use client';

import type { ReactNode, Ref } from 'react';

import { MultiSelect } from '@/shared/components/multi-select';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { cn } from '@/shared/lib/cn';

import { Label } from '../label';

export type MultiSelectFieldOption = {
  value: string;
  label: ReactNode;
  /** 드롭다운 항목 앞에 표시할 아이콘. 트리거 태그에는 포함되지 않습니다. */
  icon?: ReactNode;
  disabled?: boolean;
};

interface Props {
  name: string;
  label: string;
  options: readonly MultiSelectFieldOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  onBlur?: () => void;
  required?: boolean;
  /** 최대 선택 가능 개수. 도달 시 미선택 항목들이 자동으로 disabled 처리됩니다. */
  max?: number;
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
  onBlur,
  required,
  max,
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
  const isMaxReached = max !== undefined && selectedValue.length >= max;

  return (
    <div className={cn('relative flex flex-col gap-2', className)}>
      <Label htmlFor={`multi-select-${name}`} required={required}>
        {label}
      </Label>
      <MultiSelect.Root value={selectedValue} onValueChange={setSelectedValue}>
        <MultiSelect.Trigger ref={ref} id={`multi-select-${name}`} onBlur={onBlur} className={triggerClassName}>
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
            <MultiSelect.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled || (isMaxReached && !selectedValue.includes(option.value))}
            >
              {option.icon}
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
