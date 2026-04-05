import type { ButtonHTMLAttributes } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

export const buttonVariants = cva('inline-flex items-center justify-center rounded-lg font-medium transition-colors', {
  variants: {
    variant: {
      primary:
        'bg-button-primary-fill text-body-base font-medium text-text-basic-inverse hover:bg-button-primary-fill-hover active:bg-button-primary-fill-pressed',
      ghost: 'whitespace-nowrap text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    },
    size: {
      default: 'h-[40px] w-[90px] text-body-base leading-none',
      sm: 'px-2 py-2 text-body-base sm:px-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = ({ className, variant, size, asChild = false, children, ...restProps }: Props) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...restProps}>
      {children}
    </Comp>
  );
};
