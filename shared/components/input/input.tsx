import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  `border border-border-gray rounded-md px-4 py-3 text-body-base min-w-0 flex-1 bg-transparent text-start leading-normal outline-none placeholder:text-text-disabled focus-within:ring-border-primary focus-within:ring-2 focus-within:ring-inset`,
  {
    variants: {
      disabled: {
        true: 'border-input-border-disabled bg-input-surface-disabled text-text-disabled-on',
        false: 'border-border-gray bg-surface-white text-text-basic placeholder:text-text-disabled',
      },
    },
  },
);

interface Props extends ComponentProps<'input'>, Omit<VariantProps<typeof inputVariants>, 'disabled'> {}

export const Input = ({ disabled, className, ...restProps }: Props) => {
  return <input className={cn(inputVariants({ disabled }), className)} disabled={disabled} {...restProps} />;
};
