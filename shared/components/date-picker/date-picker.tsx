'use client';

import { Popover as PopoverPrimitive } from 'radix-ui';
import { useEffect, useRef } from 'react';

import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

import { useDatePicker } from './use-date-picker';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

interface Props {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const DatePicker = ({
  value,
  defaultValue,
  onChange,
  onBlur,
  onOpenChange,
  placeholder = '날짜를 선택해주세요',
  disabled,
  error = false,
  className,
}: Props) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { open, handleOpenChange, handleSelect, goToPrevMonth, goToNextMonth, displayDate, monthLabel, weeks } =
    useDatePicker({ value, defaultValue, onChange });

  const handleRootOpenChange = (next: boolean) => {
    handleOpenChange(next);
    onOpenChange?.(next);
  };

  // 모바일 바텀시트 등에서 달력이 화면 밖으로 잘리지 않도록, 트리거를 스크롤 영역 상단 쪽으로 올린다.
  useEffect(() => {
    if (!open) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      triggerRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth', inline: 'nearest' });
    });

    return () => cancelAnimationFrame(frameId);
  }, [open]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleRootOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onBlur={onBlur}
          aria-invalid={error || undefined}
          className={cn(
            'bg-surface-white border-input-border data-[state=open]:border-border-primary data-[state=open]:ring-border-primary flex w-full items-center justify-between gap-2 rounded-md border px-4 py-3 outline-none disabled:cursor-not-allowed data-[state=open]:ring-2 data-[state=open]:ring-inset',
            error &&
              'border-border-error ring-border-error data-[state=open]:border-border-error data-[state=open]:ring-border-error ring-2 ring-inset',
            className,
          )}
        >
          <span
            className={cn(
              'text-body-sm min-w-0 flex-1 text-left',
              displayDate !== null ? 'text-text-basic' : 'text-text-disabled',
            )}
          >
            {displayDate ?? placeholder}
          </span>
          <CalendarIcon aria-hidden className="text-text-basic size-5 shrink-0" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions={false}
          className="bg-surface-white z-[60] flex max-h-[min(360px,calc(100dvh-8rem))] w-90 max-w-[calc(100vw-32px)] flex-col overflow-y-auto overscroll-contain rounded-2xl shadow-[0px_4px_16px_rgba(96,96,96,0.3)]"
        >
          <div className="border-border-gray-light flex h-22 shrink-0 items-center justify-between border-b px-4">
            <button
              type="button"
              aria-label="이전 달"
              onClick={goToPrevMonth}
              className="text-text-basic flex size-6 shrink-0 items-center justify-center outline-none hover:cursor-pointer"
            >
              <ArrowLeftIcon aria-hidden className="size-6" />
            </button>
            <p className="text-heading-sm text-text-basic flex-1 text-center font-bold">{monthLabel}</p>
            <button
              type="button"
              aria-label="다음 달"
              onClick={goToNextMonth}
              className="text-text-basic flex size-6 shrink-0 items-center justify-center outline-none hover:cursor-pointer"
            >
              <ArrowRightIcon aria-hidden className="size-6" />
            </button>
          </div>

          <div className="border-divider-gray-light flex h-8 shrink-0 items-center border-b px-4">
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="text-body-sm text-text-basic flex flex-1 items-center justify-center font-medium"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1 px-4 py-1 pb-3">
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
                        'text-body-base hover:bg-button-tertiary-fill-hover active:bg-button-tertiary-fill-pressed flex h-10 w-full items-center justify-center rounded-md',
                        cell.isSelected && 'bg-element-primary text-text-basic-inverse hover:bg-element-primary',
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
