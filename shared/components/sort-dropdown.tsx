'use client';

import { DownIcon } from '@/shared/assets/icons';
import { Dropdown } from '@/shared/components/dropdown';
import { cn } from '@/shared/lib/cn';

export const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된 순' },
] as const;

export type SortOrder = (typeof sortOptions)[number]['value'];

const dropdownItemClassName = 'text-body-base text-text-basic h-12 min-w-[160px] justify-start px-4 font-normal';

interface SortDropdownProps {
  value: SortOrder;
  onValueChange: (value: SortOrder) => void;
  ariaLabel?: string;
  triggerClassName?: string;
}

export const SortDropdown = ({ value, onValueChange, ariaLabel = '정렬', triggerClassName }: SortDropdownProps) => {
  const selectedLabel = sortOptions.find((option) => option.value === value)?.label ?? '최신순';

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        type="button"
        className={cn(
          'text-body-base text-text-subtle flex items-center gap-1 rounded-md px-4 font-medium outline-none',
          triggerClassName,
        )}
        aria-label={ariaLabel}
      >
        {selectedLabel}
        <DownIcon className="size-4 shrink-0" aria-hidden />
      </Dropdown.Trigger>
      <Dropdown.Content
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="border-border-gray-light w-auto min-w-[160px] gap-2 p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.1)]"
      >
        {sortOptions.map((option) => (
          <Dropdown.Item
            key={option.value}
            className={dropdownItemClassName}
            onSelect={() => onValueChange(option.value)}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
