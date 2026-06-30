'use client';

import { Popover as PopoverPrimitive } from 'radix-ui';

import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

import { useDatePicker } from './use-date-picker';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

interface Props {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = ({
  value,
  defaultValue,
  onChange,
  placeholder = '날짜를 선택해주세요',
  disabled,
  className,
}: Props) => {
  const { open, handleOpenChange, handleSelect, goToPrevMonth, goToNextMonth, displayDate, monthLabel, weeks } =
    useDatePicker({ value, defaultValue, onChange });

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'bg-surface-white border-input-border data-[state=open]:border-border-primary flex w-full items-center gap-2 rounded-md border px-4 py-3 outline-none disabled:cursor-not-allowed data-[state=open]:border-2',
            className,
          )}
        >
          <CalendarIcon aria-hidden className="text-text-basic size-5 shrink-0" />
          <span
            className={cn(
              'text-body-sm flex-1 text-left',
              displayDate !== null ? 'text-text-basic' : 'text-text-disabled',
            )}
          >
            {displayDate ?? placeholder}
          </span>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="bg-surface-white z-50 flex w-90 max-w-[calc(100vw-32px)] flex-col rounded-2xl shadow-[0px_4px_16px_rgba(96,96,96,0.3)]"
        >
          <div className="border-border-gray-light flex h-22 items-center justify-between border-b px-4">
            <button
              type="button"
              aria-label="이전 달"
              onClick={goToPrevMonth}
              className="text-text-basic flex size-6 shrink-0 items-center justify-center outline-none"
            >
              <ArrowLeftIcon aria-hidden className="size-6" />
            </button>
            <p className="text-heading-sm text-text-basic flex-1 text-center font-bold">{monthLabel}</p>
            <button
              type="button"
              aria-label="다음 달"
              onClick={goToNextMonth}
              className="text-text-basic flex size-6 shrink-0 items-center justify-center outline-none"
            >
              <ArrowRightIcon aria-hidden className="size-6" />
            </button>
          </div>

          <div className="border-divider-gray-light flex h-8 items-center border-b px-4">
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="text-body-sm text-text-basic flex flex-1 items-center justify-center font-medium"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1 px-4 py-1">
            {weeks.map((week) => (
              <div key={week[0].date.toISOString()} className="flex items-center">
                {week.map((cell) => (
                  <button
                    key={cell.date.toISOString()}
                    type="button"
                    onClick={() => handleSelect(cell.date)}
                    className="flex h-10 flex-1 items-center justify-center outline-none"
                  >
                    <span
                      className={cn(
                        'text-body-base flex h-10 w-full items-center justify-center rounded-md',
                        cell.isSelected && 'bg-element-primary text-text-basic-inverse',
                        !cell.isSelected && (cell.isCurrentMonth ? 'text-text-subtle' : 'text-text-disabled'),
                      )}
                    >
                      {cell.day}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
