'use client';

import type { ReactNode } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Dropdown } from '@/shared/components/dropdown';
import { cn } from '@/shared/lib/cn';

import type { ProjectListFilterStatus, ProjectSort } from '../project.types';

import { PROJECT_LIST_STATUS_OPTIONS, PROJECT_SORT_OPTIONS } from '../project.constants';

const filterTriggerClassName =
  'text-body-base text-text-subtle flex items-center gap-1 rounded-md px-4 font-medium outline-none';
const filterItemClassName = 'text-body-base text-text-basic h-12 min-w-[160px] justify-start px-4 font-normal';

interface FilterDropdownProps<T extends string> {
  value: T;
  options: readonly { value: T; label: string }[];
  onValueChange: (value: T) => void;
  ariaLabel: string;
}

const FilterDropdown = <T extends string>({ value, options, onValueChange, ariaLabel }: FilterDropdownProps<T>) => {
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <Dropdown.Root>
      <Dropdown.Trigger type="button" className={cn(filterTriggerClassName)} aria-label={ariaLabel}>
        {selectedLabel}
        <DownIcon className="size-4 shrink-0" aria-hidden />
      </Dropdown.Trigger>
      <Dropdown.Content
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="border-border-gray-light w-auto min-w-[160px] gap-2 p-2 shadow-[0px_8px_24px_rgba(0,0,0,0.1)]"
      >
        {options.map((option) => (
          <Dropdown.Item
            key={option.value}
            className={filterItemClassName}
            onSelect={() => onValueChange(option.value)}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

interface Props {
  status: ProjectListFilterStatus;
  sort: ProjectSort;
  onStatusChange: (status: ProjectListFilterStatus) => void;
  onSortChange: (sort: ProjectSort) => void;
  children: ReactNode;
}

export const ProjectListSection = ({ status, sort, onStatusChange, onSortChange, children }: Props) => (
  <section className="border-border-gray mt-[30px] mb-20 overflow-hidden rounded-2xl border">
    <div className="bg-surface-gray-subtle border-border-gray flex h-16 items-center justify-end border-b px-8">
      <div className="flex items-center gap-2">
        <FilterDropdown
          value={status}
          options={PROJECT_LIST_STATUS_OPTIONS}
          onValueChange={onStatusChange}
          ariaLabel="상태 필터"
        />
        <FilterDropdown value={sort} options={PROJECT_SORT_OPTIONS} onValueChange={onSortChange} ariaLabel="정렬" />
      </div>
    </div>
    <div className="flex flex-col gap-6 p-8">{children}</div>
  </section>
);
