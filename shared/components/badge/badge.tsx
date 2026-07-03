import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'bg-surface-gray-subtle inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-sm font-medium',
  {
    variants: {
      size: {
        medium: 'text-heading-xs text-text-subtle px-2 py-1',
        small: 'text-body-sm text-text-subtler px-1 py-0.5',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
);

interface Props extends ComponentPropsWithRef<'span'>, VariantProps<typeof badgeVariants> {
  icon?: ReactElement;
  children: ReactNode;
}

export const Badge = ({ ref, className, size, icon, children, ...restProps }: Props) => {
  const iconSizeClass = size === 'small' ? 'size-4' : 'size-5';

  return (
    <span ref={ref} className={cn(badgeVariants({ size }), className)} {...restProps}>
      {icon ? (
        <span aria-hidden className={cn('inline-flex shrink-0 items-center justify-center', iconSizeClass)}>
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </span>
  );
};
