'use client';

import { RadioGroup } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

import type { WithdrawReasonValue } from '../auth.constants';

interface WithdrawReasonOption {
  value: WithdrawReasonValue;
  label: string;
}

interface WithdrawReasonRadioGroupProps {
  value?: WithdrawReasonValue;
  onValueChange: (value: WithdrawReasonValue) => void;
  options: readonly WithdrawReasonOption[];
  name: string;
  ariaLabel: string;
  className?: string;
}

export const WithdrawReasonRadioGroup = ({
  value,
  onValueChange,
  options,
  name,
  ariaLabel,
  className,
}: WithdrawReasonRadioGroupProps) => {
  return (
    <RadioGroup.Root
      value={value ?? ''}
      onValueChange={(next) => onValueChange(next as WithdrawReasonValue)}
      aria-label={ariaLabel}
      className={cn('flex shrink-0 flex-col gap-4', className)}
    >
      {options.map((option) => {
        const optionId = `${name}-${option.value}`;
        const optionLabelId = `${optionId}-label`;
        const checked = value === option.value;

        return (
          <label key={option.value} className="flex cursor-pointer items-center gap-2" htmlFor={optionId}>
            <RadioGroup.Item
              value={option.value}
              id={optionId}
              className={cn(
                'focus-visible:ring-border-primary flex size-6 shrink-0 items-center justify-center rounded-2xl border border-solid outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                checked ? 'border-border-primary bg-bg-white' : 'border-border-gray bg-bg-white',
              )}
              aria-labelledby={optionLabelId}
            >
              <RadioGroup.Indicator className="bg-element-primary flex size-4 items-center justify-center rounded-2xl" />
            </RadioGroup.Item>
            <span
              id={optionLabelId}
              className={cn(
                'text-body-base font-bold whitespace-nowrap',
                checked ? 'text-text-basic' : 'text-text-subtle',
              )}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </RadioGroup.Root>
  );
};
