import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib/cn';

type ProjectMemberReviewStatusChipState = 'writable' | 'completed' | 'self';

interface ProjectMemberReviewStatusChipProps extends ComponentPropsWithRef<'div'> {
  name: string;
  state: ProjectMemberReviewStatusChipState;
}

const reviewStatusBadge = {
  completed: {
    label: '완료',
    wrapper: 'bg-surface-success-subtler text-text-success',
    dot: 'bg-element-success',
  },
  writable: {
    label: '작성 전',
    wrapper: 'bg-surface-warning-subtler text-text-warning',
    dot: 'bg-element-warning',
  },
} as const;

export const ProjectMemberReviewStatusChip = ({
  className,
  name,
  state,
  ...restProps
}: ProjectMemberReviewStatusChipProps) => {
  const badge = state === 'self' ? null : reviewStatusBadge[state];

  return (
    <div
      className={cn(
        'border-border-gray bg-surface-white inline-flex items-center gap-2 rounded-md border py-1 pr-2 pl-4',
        className,
      )}
      {...restProps}
    >
      <span className="text-body-base text-text-subtle font-medium whitespace-nowrap">{name}</span>

      {badge ? (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5', badge.wrapper)}>
          <span className={cn('size-2 shrink-0 rounded-full', badge.dot)} />
          <span className="text-detail-xs font-normal whitespace-nowrap">{badge.label}</span>
        </span>
      ) : null}
    </div>
  );
};
