import type { ComponentProps, ReactElement, ReactNode } from 'react';

import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import type { VariantProps } from 'class-variance-authority';

import { cn } from '../lib/cn';

const projectStateBadgeVariants = cva(
  'w-fit px-2 py-1 rounded-full inline-flex items-center justify-center gap-1 text-detail-xs font-medium',
  {
    variants: {
      status: {
        waiting: 'bg-element-warning text-text-basic-inverse',
        error: 'bg-element-error text-text-basic-inverse',
        success: 'bg-element-success text-text-basic-inverse',
      },
    },
    defaultVariants: {
      status: 'waiting',
    },
  },
);

interface Props extends ComponentProps<'span'>, VariantProps<typeof projectStateBadgeVariants> {
  children: ReactNode;
  asChild?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
}

export const ProjectStateBadge = ({
  status,
  children,
  leftIcon,
  rightIcon,
  className,
  asChild,
  ...restProps
}: Props) => {
  const Component = asChild ? Slot.Root : 'span';

  return (
    <Component className={cn(projectStateBadgeVariants({ status }), className)} {...restProps}>
      {leftIcon}
      <Slot.Slottable>{children}</Slot.Slottable>
      {rightIcon}
    </Component>
  );
};
