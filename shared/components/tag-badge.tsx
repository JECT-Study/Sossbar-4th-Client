import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const tagBadgeVariants = cva(
  'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-disabled bg-white px-4 py-2 text-body-base font-medium',
  {
    variants: {
      priority: {
        default: 'text-text-subtle',
        rank: 'text-text-basic',
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
  /** TOP3 순위 배지. 값이 있으면 `#1` 형식으로 순위를 표시 */
  rank?: number;
}

export const TagBadge = ({ ref, children, className, count, priority, rank, ...restProps }: Props) => {
  const resolvedPriority = rank != null ? 'rank' : priority;

  return (
    <span ref={ref} className={cn(tagBadgeVariants({ priority: resolvedPriority }), className)} {...restProps}>
      {rank != null ? (
        <span className="flex items-center gap-1">
          <span>#{rank}</span>
          <span>{children}</span>
        </span>
      ) : (
        <span>{children}</span>
      )}
      {count !== undefined ? <span>{count}</span> : null}
    </span>
  );
};
