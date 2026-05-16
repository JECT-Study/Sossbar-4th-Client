import { cn } from '@/shared/lib/cn';

type SegmentedControlOption<TValue extends string> = {
  value: TValue;
  label: string;
};

type SegmentedControlProps<TValue extends string> = {
  options: readonly SegmentedControlOption<TValue>[];
  value: TValue;
  onValueChange: (value: TValue) => void;
  className?: string;
};

export const SegmentedControl = <TValue extends string>({
  options,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<TValue>) => {
  return (
    <div
      className={cn(
        'border-border-gray-light bg-bg-gray-subtler flex shrink-0 items-center rounded-full border p-1',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              'text-heading-xs cursor-pointer rounded-full px-6 py-1 font-medium transition-colors',
              isSelected
                ? 'bg-element-secondary text-text-basic-inverse shadow-[0_4px_16px_rgba(96,96,96,0.3)]'
                : 'text-text-subtle',
            )}
            aria-pressed={isSelected}
            onClick={() => onValueChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
