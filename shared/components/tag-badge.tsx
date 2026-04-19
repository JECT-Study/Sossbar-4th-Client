import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

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
      size: {
        medium: 'px-3 py-2 text-detail-base',
        small: 'px-2.5 py-1.5 text-detail-sm',
      },
    },
    defaultVariants: {
      priority: 'default',
      size: 'medium',
      disabled: false,
    },
  },
);

interface Props extends ComponentPropsWithRef<'span'>, VariantProps<typeof tagBadgeVariants> {
  children: ReactNode;
  asChild?: boolean;
  count: string | number;
}

export const TagBadge = ({
  disabled,
  children,
  className,
  asChild,
  count,
  size,
  priority,
  ref,
  ...restProps
}: Props) => {
  const Component = asChild ? Slot.Root : 'span';
  const hasRanking = priority !== 'default';
  const countColor = disabled || hasRanking ? 'text-inherit' : 'text-text-subtle';

  return (
    <Component
      className={cn(tagBadgeVariants({ disabled, size, priority }), className)}
      aria-disabled={Boolean(disabled)}
      ref={ref}
      {...restProps}
    >
      <div className="flex items-center gap-1">
        <span>#</span>
        <span>{children}</span>
        {Number(count) > 1 ? <span className={countColor}>{count}</span> : null}
      </div>
    </Component>
  );
};
