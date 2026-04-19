'use client';

import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { DeleteIcon } from '@/shared/assets/icons';
import { useControllableState } from '@/shared/hooks/use-controllable-state';
import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const tagBadgeVariants = cva(
  'w-fit rounded-full inline-flex items-center justify-center font-normal transition-colors text-text-basic cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-secondary',
  {
    variants: {
      priority: {
        default:
          'bg-action-gray-light border border-border-gray-light hover:border-action-secondary-hover hover:bg-action-secondary-hover active:bg-action-secondary-pressed active:border-action-secondary-pressed',
        first: 'bg-action-tag-primary text-text-basic-inverse font-medium',
        second: 'bg-action-tag-secondary text-text-basic-inverse font-medium',
        third: 'bg-action-tag-tertiary text-text-secondary font-medium',
      },
      disabled: {
        true: 'bg-action-disabled border-none cursor-not-allowed text-text-disabled hover:bg-action-disabled active:bg-action-disabled focus-visible:outline-none',
        false: '',
      },
      readOnly: {
        true: 'cursor-default pointer-events-none',
        false: '',
      },
      checked: {
        true: 'bg-action-secondary-selected border border-action-primary-active hover:border-action-primary-active',
        false: '',
      },
      size: {
        medium: 'px-3 py-2 text-detail-base',
        small: 'px-2.5 py-1.5 text-detail-sm',
      },
    },
    defaultVariants: {
      priority: 'default',
      size: 'medium',
      disabled: false,
      checked: false,
      readOnly: false,
    },
  },
);

interface Props
  extends
    Omit<ComponentPropsWithRef<'button'>, 'checked' | 'defaultChecked' | 'disabled'>,
    VariantProps<typeof tagBadgeVariants> {
  children: ReactNode;
  count?: string | number;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  readOnly?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const TagBadge = ({
  ref,
  disabled,
  children,
  className,
  count,
  size,
  priority,
  checked: checkedProp,
  defaultChecked,
  readOnly,
  onCheckedChange,
  onClick,
  ...restProps
}: Props) => {
  const hasRanking = priority !== 'default';
  const countColor = disabled || hasRanking ? 'text-inherit' : 'text-text-subtle';
  const isToggleable = !hasRanking;

  const [checked, setChecked] = useControllableState({
    prop: isToggleable ? checkedProp : false,
    defaultProp: isToggleable ? (defaultChecked ?? false) : false,
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
      className={cn(tagBadgeVariants({ disabled, size, priority, checked, readOnly }), className)}
      disabled={Boolean(disabled)}
      onClick={handleClick}
      {...restProps}
    >
      <div className="flex items-center gap-1">
        <span>#</span>
        <span>{children}</span>
        {count !== undefined && Number(count) > 1 ? <span className={countColor}>{count}</span> : null}
        {checked && !disabled && !readOnly ? (
          <span aria-hidden className="ml-0.5 leading-none">
            <DeleteIcon />
          </span>
        ) : null}
      </div>
    </button>
  );
};
