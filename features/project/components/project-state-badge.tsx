import type { ComponentPropsWithRef } from 'react';

import { cva } from 'class-variance-authority';

import { CheckFilledIcon, TimeIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const projectStateBadgeVariants = cva(
  'inline-flex h-6.5 w-fit items-center justify-center gap-1 rounded-full px-2 text-detail-xs font-medium',
  {
    variants: {
      variant: {
        waiting: 'bg-element-warning text-text-basic-inverse',
        success: 'bg-element-success text-text-basic-inverse',
        leader: 'bg-transparent text-element-secondary border border-element-secondary',
      },
    },
    defaultVariants: {
      variant: 'waiting',
    },
  },
);

type Props = Omit<ComponentPropsWithRef<'span'>, 'children'> & VariantProps<typeof projectStateBadgeVariants>;

const projectStateBadgeContents = {
  waiting: {
    icon: <TimeIcon aria-hidden className="size-4 shrink-0" />,
    label: '대기중',
  },
  success: {
    icon: <CheckFilledIcon aria-hidden className="size-4 shrink-0" />,
    label: '확정됨',
  },
  leader: {
    icon: null,
    label: '방장',
  },
} as const;

export const ProjectStateBadge = ({ variant, className, ...restProps }: Props) => {
  const selectedVariant = variant ?? 'waiting';
  const { icon, label } = projectStateBadgeContents[selectedVariant];

  return (
    <span className={cn(projectStateBadgeVariants({ variant: selectedVariant }), className)} {...restProps}>
      {icon}
      {label}
    </span>
  );
};
