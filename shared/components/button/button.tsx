import type { ComponentProps, ReactElement } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors gap-1 self-start',
  {
    variants: {
      variant: {
        primary:
          'bg-button-primary-fill hover:bg-button-primary-fill-hover focus:bg-button-primary-fill-focus active:bg-button-primary-fill-pressed text-text-basic-inverse',
        secondary:
          'border border-button-secondary-border text-text-primary bg-button-secondary-fill hover:bg-button-secondary-fill-hover focus:bg-button-secondary-fill-focus active:bg-button-secondary-fill-pressed',
        tertiary:
          'bg-button-tertiary-fill hover:bg-button-tertiary-fill-hover focus:bg-button-tertiary-fill-focus active:bg-button-tertiary-fill-pressed text-text-basic',
      },
      size: {
        large: 'px-7 py-3 text-body-xl rounded-lg',
        medium: 'py-2 px-[18px] rounded-md text-body-base',
        small: 'px-4 py-2 text-body-sm rounded-sm',
      },
      disabled: {
        true: 'bg-button-disabled-fill text-text-disabled cursor-not-allowed hover:bg-button-disabled-fill hover:text-text-disabled focus:bg-button-disabled-fill focus:text-text-disabled active:bg-button-disabled-fill active:text-text-disabled border-none',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        disabled: true,
      },
      {
        variant: 'secondary',
        disabled: true,
      },
      {
        variant: 'tertiary',
        disabled: true,
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      disabled: false,
    },
  },
);

interface Props extends ComponentProps<'button'>, Omit<VariantProps<typeof buttonVariants>, 'disabled'> {
  asChild?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
}

export const Button = ({
  className,
  variant,
  size,
  children,
  disabled,
  asChild,
  leftIcon,
  rightIcon,
  ...restProps
}: Props) => {
  const Component = asChild ? Slot.Root : 'button';

  return (
    <Component
      className={cn(buttonVariants({ variant, size, disabled }), className)}
      disabled={disabled}
      {...restProps}
    >
      {Boolean(leftIcon) && leftIcon}
      <Slot.Slottable>{children}</Slot.Slottable>
      {Boolean(rightIcon) && rightIcon}
    </Component>
  );
};
