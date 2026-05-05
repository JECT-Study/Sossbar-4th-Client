import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

export const tabAtomicVariants = cva('h-10 cursor-pointer transition-colors text-center', {
  variants: {
    variant: {
      primary: 'px-1 text-heading-sm font-bold',
      secondary: 'px-[10.5px] text-heading-xs font-medium',
    },
    active: {
      true: 'text-text-secondary',
      false: 'text-text-subtle hover:bg-action-secondary-hover active:bg-action-secondary-pressed',
    },
  },
  defaultVariants: {
    variant: 'primary',
    active: false,
  },
});

interface Props extends ComponentProps<'button'>, Omit<VariantProps<typeof tabAtomicVariants>, 'active'> {
  active?: boolean;
}

export const TabAtomic = ({ className, variant, active = false, children, ...restProps }: Props) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(tabAtomicVariants({ variant, active }), className)}
      {...restProps}
    >
      {children}
    </button>
  );
};
