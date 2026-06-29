'use client';

import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';

import { Popover as PopoverPrimitive } from 'radix-ui';
import { createContext, useCallback, useContext, useMemo } from 'react';

import { CheckIcon, DropdownIcon, XIcon } from '@/shared/assets/icons';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { cn } from '@/shared/lib/cn';

interface MultiSelectContextValue {
  value: string[];
  toggle: (itemValue: string) => void;
  remove: (itemValue: string) => void;
}

const MultiSelectContext = createContext<MultiSelectContextValue | null>(null);

const useMultiSelectContext = () => {
  const context = useContext(MultiSelectContext);

  if (context === null) {
    throw new Error('MultiSelect 컴포넌트는 <MultiSelect.Root> 내부에서만 사용할 수 있습니다.');
  }

  return context;
};

interface MultiSelectRootProps {
  children: ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MultiSelectRoot = ({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
}: MultiSelectRootProps) => {
  const [selectedValue, setSelectedValue] = useControllableState<string[]>({
    prop: value,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const toggle = useCallback(
    (itemValue: string) => {
      setSelectedValue((prev) =>
        prev.includes(itemValue) ? prev.filter((item) => item !== itemValue) : [...prev, itemValue],
      );
    },
    [setSelectedValue],
  );

  const remove = useCallback(
    (itemValue: string) => {
      setSelectedValue((prev) => prev.filter((item) => item !== itemValue));
    },
    [setSelectedValue],
  );

  const contextValue = useMemo<MultiSelectContextValue>(
    () => ({ value: selectedValue, toggle, remove }),
    [selectedValue, toggle, remove],
  );

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </PopoverPrimitive.Root>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectTrigger = ({
  children,
  className,
  ...restProps
}: ComponentPropsWithRef<typeof PopoverPrimitive.Trigger>) => {
  return (
    <PopoverPrimitive.Trigger asChild {...restProps}>
      <button
        type="button"
        className={cn(
          'group border-input-border bg-input-surface text-body-sm flex h-12 min-h-11.25 w-full items-center justify-between gap-2 rounded-md border px-3 outline-none',
          className,
        )}
      >
        <span className="flex flex-1 flex-wrap items-center gap-1.5">{children}</span>
        <DropdownIcon aria-hidden className="text-input-border size-5 shrink-0 group-data-[state=open]:rotate-180" />
      </button>
    </PopoverPrimitive.Trigger>
  );
};

const MultiSelectContent = ({
  children,
  className,
  align = 'start',
  sideOffset = 4,
  ...restProps
}: ComponentPropsWithRef<typeof PopoverPrimitive.Content>) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn('bg-input-surface z-50 flex flex-col overflow-hidden rounded-md shadow-lg', className)}
        {...restProps}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
};

interface MultiSelectItemProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const MultiSelectItem = ({ value, children, className, disabled = false }: MultiSelectItemProps) => {
  const { value: selectedValue, toggle } = useMultiSelectContext();
  const isChecked = selectedValue.includes(value);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={() => toggle(value)}
      className={cn(
        'text-body-sm text-text-basic hover:bg-action-gray-light data-[state=checked]:bg-action-secondary-selected flex h-12 cursor-pointer items-center gap-3 px-4 text-left font-medium outline-none',
        'disabled:text-text-disabled disabled:cursor-not-allowed disabled:hover:bg-transparent',
        className,
      )}
      data-state={isChecked ? 'checked' : 'unchecked'}
    >
      <span
        aria-hidden
        className={cn(
          'relative flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
          isChecked ? 'border-button-primary-fill bg-button-primary-fill' : 'border-divider-gray bg-white',
          disabled && !isChecked && 'border-element-disabled-light bg-bg-gray-subtler',
        )}
      >
        {isChecked ? (
          <CheckIcon className="text-text-basic-inverse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        ) : null}
      </span>
      <span>{children}</span>
    </button>
  );
};

interface MultiSelectTagProps {
  value: string;
  children: ReactNode;
  onRemove?: (value: string) => void;
  className?: string;
}

const MultiSelectTag = ({ value, children, onRemove, className }: MultiSelectTagProps) => {
  const { remove } = useMultiSelectContext();

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    (onRemove ?? remove)(value);
  };

  return (
    <span
      className={cn(
        'bg-action-secondary-selected text-text-basic text-detail-sm border-action-tag-primary inline-flex items-center gap-1 rounded-full border py-1 pr-2 pl-3 font-medium',
        className,
      )}
    >
      {children}
      <button
        type="button"
        aria-label="선택 해제"
        onClick={handleRemove}
        className="flex shrink-0 items-center justify-center hover:cursor-pointer"
      >
        <XIcon aria-hidden className="text-text-subtle size-3.5" />
      </button>
    </span>
  );
};

export const MultiSelect = {
  Root: MultiSelectRoot,
  Trigger: MultiSelectTrigger,
  Content: MultiSelectContent,
  Item: MultiSelectItem,
  Tag: MultiSelectTag,
};
