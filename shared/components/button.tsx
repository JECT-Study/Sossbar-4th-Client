import type { ButtonHTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('inline-flex items-center justify-center rounded-lg font-medium transition-colors', {
  variants: {
    variant: {
      primary:
        'bg-button-primary-fill text-button-text-fill hover:bg-button-primary-fill-hover active:bg-button-primary-fill-pressed',
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

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
};
