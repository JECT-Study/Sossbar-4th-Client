import { useState } from 'react';

import { useControllableState } from '@/shared/hooks/use-controllable-state';

interface CalendarCell {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
}

const isSameDay = (a: Date | null, b: Date | null) =>
  a !== null &&
  b !== null &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

const formatDisplayDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

const formatMonthTitle = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const getCalendarWeeks = (viewDate: Date, selectedDate: Date | null): CalendarCell[][] => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const cursor = new Date(year, month, 1 - firstWeekday);
  const weeks: CalendarCell[][] = [];

  do {
    const week: CalendarCell[] = [];

    for (let i = 0; i < 7; i += 1) {
      week.push({
        date: new Date(cursor),
        day: cursor.getDate(),
        isCurrentMonth: cursor.getMonth() === month,
        isSelected: isSameDay(cursor, selectedDate),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    weeks.push(week);
  } while (cursor.getMonth() === month);

  return weeks;
};

interface UseDatePickerParams {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
}

export const useDatePicker = ({ value, defaultValue, onChange }: UseDatePickerParams) => {
  const [selectedDate, setSelectedDate] = useControllableState<Date | null>({
    prop: value,
    defaultProp: defaultValue ?? null,
    onChange,
  });

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate ?? new Date());

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    // 열릴 때마다 선택된 날짜(없으면 오늘)가 속한 달을 보여준다.
    if (next) {
      setViewDate(selectedDate ?? new Date());
    }
  };

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    setOpen(false);
  };

  const goToPrevMonth = () => setViewDate((prev) => addMonths(prev, -1));
  const goToNextMonth = () => setViewDate((prev) => addMonths(prev, 1));

  return {
    open,
    handleOpenChange,
    handleSelect,
    goToPrevMonth,
    goToNextMonth,
    displayDate: selectedDate !== null ? formatDisplayDate(selectedDate) : null,
    monthLabel: formatMonthTitle(viewDate),
    weeks: getCalendarWeeks(viewDate, selectedDate),
  };
};
