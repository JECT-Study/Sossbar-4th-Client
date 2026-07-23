'use client';

import type { ReactNode } from 'react';

import { Dialog } from 'radix-ui';
import { Fragment, useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Dropdown } from '@/shared/components/dropdown';
import { cn } from '@/shared/lib/cn';

import type { ProjectListFilterStatus, ProjectSort } from '../project.types';

import { PROJECT_LIST_STATUS_OPTIONS, PROJECT_SORT_OPTIONS } from '../project.constants';

const statusTriggerClassName =
  'text-detail-xs text-text-subtle flex cursor-pointer items-center gap-1 rounded-xs px-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2';

const statusMenuItemClassName = cn(
  'text-body-sm w-full px-5 py-4 text-left font-normal transition-colors outline-none',
  'text-text-basic hover:bg-action-secondary-hover hover:text-text-primary',
  'focus-visible:bg-action-secondary-hover focus-visible:text-text-primary',
);

interface StatusFilterProps {
  value: ProjectListFilterStatus;
  onValueChange: (value: ProjectListFilterStatus) => void;
}

const StatusFilterBottomSheet = ({
  open,
  onOpenChange,
  value,
  onValueChange,
}: StatusFilterProps & { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black-75 fixed inset-0 z-50" />
      <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 outline-none">
        <div className="bg-surface-white flex w-full flex-col rounded-t-2xl">
          <Dialog.Title className="text-body-base text-text-basic px-5 py-4 font-bold">전체</Dialog.Title>
          <Dialog.Description className="sr-only">프로젝트 상태 필터를 선택하세요</Dialog.Description>
          <ul className="flex flex-col pb-5">
            {PROJECT_LIST_STATUS_OPTIONS.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={cn(statusMenuItemClassName, isSelected && 'bg-action-secondary-hover text-text-primary')}
                    onClick={() => {
                      onValueChange(option.value);
                      onOpenChange(false);
                    }}
                  >
                    {option.menuLabel}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const StatusFilter = ({ value, onValueChange }: StatusFilterProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const selectedLabel = PROJECT_LIST_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? '전체';

  return (
    <>
      <button
        type="button"
        className={cn(statusTriggerClassName, 'lg:hidden')}
        aria-label="상태 필터"
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
        onClick={() => setSheetOpen(true)}
      >
        {selectedLabel}
        <DownIcon className="size-2.5 shrink-0" aria-hidden />
      </button>

      <div className="hidden lg:block">
        <Dropdown.Root>
          <Dropdown.Trigger type="button" className={statusTriggerClassName} aria-label="상태 필터">
            {selectedLabel}
            <DownIcon className="size-2.5 shrink-0" aria-hidden />
          </Dropdown.Trigger>
          <Dropdown.Content
            align="start"
            sideOffset={8}
            collisionPadding={16}
            className="border-border-gray-light w-auto min-w-[160px] gap-0 p-0 shadow-[0px_8px_24px_rgba(0,0,0,0.1)]"
          >
            {PROJECT_LIST_STATUS_OPTIONS.map((option) => {
              const isSelected = option.value === value;

              return (
                <Dropdown.Item
                  key={option.value}
                  className={cn(
                    'text-body-sm text-text-basic h-auto justify-start rounded-none px-5 py-4 font-normal',
                    'hover:bg-action-secondary-hover hover:text-text-primary',
                    'data-[highlighted]:bg-action-secondary-hover data-[highlighted]:text-text-primary',
                    isSelected && 'bg-action-secondary-hover text-text-primary',
                  )}
                  onSelect={() => onValueChange(option.value)}
                >
                  {option.menuLabel}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Content>
        </Dropdown.Root>
      </div>

      <StatusFilterBottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        value={value}
        onValueChange={onValueChange}
      />
    </>
  );
};

interface SortFilterProps {
  value: ProjectSort;
  onValueChange: (value: ProjectSort) => void;
}

const SortFilter = ({ value, onValueChange }: SortFilterProps) => (
  <div role="group" aria-label="프로젝트 정렬" className="text-detail-xs flex items-center gap-2 font-medium">
    {PROJECT_SORT_OPTIONS.map((option, index) => (
      <Fragment key={option.value}>
        {index > 0 ? (
          <span aria-hidden className="text-text-disabled">
            ·
          </span>
        ) : null}
        <button
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onValueChange(option.value)}
          className={cn(
            'focus-visible:ring-border-primary cursor-pointer rounded-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            value === option.value ? 'text-text-subtle' : 'text-text-disabled',
          )}
        >
          {option.label}
        </button>
      </Fragment>
    ))}
  </div>
);

interface Props {
  status: ProjectListFilterStatus;
  sort: ProjectSort;
  onStatusChange: (status: ProjectListFilterStatus) => void;
  onSortChange: (sort: ProjectSort) => void;
  children: ReactNode;
}

export const ProjectListSection = ({ status, sort, onStatusChange, onSortChange, children }: Props) => (
  <section className="border-border-gray mt-[30px] mb-20 overflow-hidden rounded-2xl border">
    <div className="bg-surface-gray-subtle border-border-gray flex h-[65px] items-center justify-between border-b px-4 lg:px-8">
      <StatusFilter value={status} onValueChange={onStatusChange} />
      <SortFilter value={sort} onValueChange={onSortChange} />
    </div>
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-8">{children}</div>
  </section>
);
