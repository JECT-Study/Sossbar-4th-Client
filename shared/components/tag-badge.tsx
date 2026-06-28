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
        rank: 'border border-border-gray bg-white text-text-basic gap-2 px-3 py-1.5',
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
  /** TOP3 순위 배지. 값이 있으면 흰색 테두리 칩에 순위 마커를 표시 */
  rank?: number;
}

export const TagBadge = ({ ref, children, className, count, priority, rank, ...restProps }: Props) => {
  const resolvedPriority = rank != null ? 'rank' : priority;
  const isColored = resolvedPriority === 'first' || resolvedPriority === 'second' || resolvedPriority === 'third';
  const countColor = isColored ? 'text-inherit' : 'text-text-subtle';

  return (
    <span ref={ref} className={cn(tagBadgeVariants({ priority: resolvedPriority }), className)} {...restProps}>
      {rank != null ? (
        <span className="bg-element-secondary text-text-basic-inverse text-detail-xs flex size-5 shrink-0 items-center justify-center rounded-full font-bold">
          {rank}
        </span>
      ) : null}
      <span>#</span>
      <span>{children}</span>
      {count !== undefined && Number(count) > 1 ? <span className={countColor}>{count}</span> : null}
    </span>
  );
};
