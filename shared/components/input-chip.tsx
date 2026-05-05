'use client';

import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { DeleteIcon } from '@/shared/assets/icons';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const inputChipVariants = cva(
  'w-fit px-2.5 py-1.5 rounded-full inline-flex items-center justify-center gap-0.5 font-normal text-detail-sm transition-colors text-text-basic cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-secondary',
  {
    variants: {
      disabled: {
        true: 'bg-action-disabled border-none cursor-not-allowed text-text-disabled hover:bg-action-disabled active:bg-action-disabled focus-visible:outline-none',
        false:
          'bg-action-gray-light border border-border-gray-light hover:border-action-secondary-hover hover:bg-action-secondary-hover active:bg-action-secondary-pressed active:border-action-secondary-pressed',
      },
      checked: {
        true: 'bg-action-secondary-selected border border-action-primary-active hover:border-action-primary-active pr-2',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
      checked: false,
    },
  },
);

interface Props
  extends
    Omit<ComponentPropsWithRef<'button'>, 'checked' | 'defaultChecked' | 'disabled'>,
    VariantProps<typeof inputChipVariants> {
  children: ReactNode;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const InputChip = ({
  ref,
  disabled,
  children,
  className,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  onClick,
  ...restProps
}: Props) => {
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
  });

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setChecked((prev) => !prev);
    onClick?.(event);
  };

  return (
    <button
      type="button"
      ref={ref}
      className={cn(inputChipVariants({ disabled, checked }), className)}
      disabled={Boolean(disabled)}
      onClick={handleClick}
      {...restProps}
    >
      <span>{children}</span>
      {checked && !disabled ? (
        <span aria-hidden className="leading-none">
          <DeleteIcon className="h-4 w-4" />
        </span>
      ) : null}
    </button>
  );
};
