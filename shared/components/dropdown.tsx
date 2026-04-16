'use client';

import type { ComponentProps } from 'react';

import { Slot } from 'radix-ui';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);
const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown 하위 컴포넌트들은 반드시 Dropdown.Root 내부에서 사용되어야 합니다.');
  }
  return context;
};

const DropdownRoot = ({ children, className, ...props }: ComponentProps<'div'>) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className={cn('relative inline-block', className)} ref={rootRef} {...props}>
      <DropdownContext.Provider value={{ isOpen: open, toggle: () => setOpen(!open), close: () => setOpen(false) }}>
        {children}
      </DropdownContext.Provider>
    </div>
  );
};

interface DropdownTriggerProps extends ComponentProps<'button'> {
  asChild?: boolean;
}

const DropdownTrigger = ({ children, asChild = true, ...props }: DropdownTriggerProps) => {
  const Component = asChild ? Slot.Root : 'button';
  const { toggle } = useDropdownContext();
  return (
    <Component onClick={toggle} {...props}>
      {children}
    </Component>
  );
};

const DropdownContent = ({ children, className, ...props }: ComponentProps<'div'>) => {
  const { isOpen } = useDropdownContext();
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-surface-white border-border-gray-light absolute z-50 mt-2 flex w-44 flex-col rounded-lg border p-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface DropdownItemProps extends ComponentProps<'button'> {
  asChild?: boolean;
}

const DropdownItem = ({ children, asChild, className, ...props }: DropdownItemProps) => {
  const Component = asChild ? Slot.Root : 'button';
  const { close: closeDropdown } = useDropdownContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    closeDropdown();
  };

  return (
    <Component
      className={cn(
        'text-body-base bg-action-secondary hover:bg-action-secondary-hover active:bg-action-secondary-pressed text-text-basic flex h-12 w-full items-center justify-between rounded-md px-4',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
};
