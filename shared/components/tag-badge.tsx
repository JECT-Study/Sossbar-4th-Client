import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const tagBadgeVariants = cva(
  'w-fit rounded-full inline-flex items-center justify-center gap-2 text-detail-base font-medium px-4 py-2',
  {
    variants: {
      priority: {
        default:
          'bg-action-gray-light border border-border-gray-light font-normal gap-1 px-2.5 py-1.5 text-detail-sm text-text-basic',
        first: 'bg-action-tag-primary text-text-basic-inverse',
        second: 'bg-action-tag-secondary text-text-basic-inverse',
        third: 'bg-action-tag-tertiary text-text-secondary',
      },
    },
    defaultVariants: {
      priority: 'default',
    },
  },
);

interface Props extends ComponentPropsWithRef<'span'>, VariantProps<typeof tagBadgeVariants> {
  children: ReactNode;
  count?: string | number;
}

export const TagBadge = ({ ref, children, className, count, priority, ...restProps }: Props) => {
  const countColor = priority === 'default' ? 'text-text-subtle' : 'text-inherit';

  return (
    <span ref={ref} className={cn(tagBadgeVariants({ priority }), className)} {...restProps}>
      <span>#</span>
      <span>{children}</span>
      {count !== undefined && Number(count) > 1 ? <span className={countColor}>{count}</span> : null}
    </span>
  );
};
