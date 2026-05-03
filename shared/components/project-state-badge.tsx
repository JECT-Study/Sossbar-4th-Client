import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const projectStateBadgeVariants = cva(
  'w-fit px-2 h-6.5 rounded-full inline-flex items-center justify-center gap-1 text-detail-xs font-medium',
  {
    variants: {
      variant: {
        waiting: 'bg-element-warning text-text-basic-inverse',
        error: 'bg-element-error text-text-basic-inverse',
        success: 'bg-element-success text-text-basic-inverse',
        host: 'bg-transparent text-element-secondary border border-element-secondary',
      },
    },
    defaultVariants: {
      variant: 'waiting',
    },
  },
);

interface Props extends ComponentPropsWithRef<'span'>, VariantProps<typeof projectStateBadgeVariants> {
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  children: ReactNode;
}

export const ProjectStateBadge = ({ variant, children, leftIcon, rightIcon, className, ...restProps }: Props) => {
  return (
    <span className={cn(projectStateBadgeVariants({ variant }), className)} {...restProps}>
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  );
};
