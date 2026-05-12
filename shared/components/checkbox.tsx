import type { ComponentPropsWithRef } from 'react';

import { cva } from 'class-variance-authority';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import type { VariantProps } from 'class-variance-authority';

import { CheckIcon } from '../assets/icons';
import { cn } from '../lib/cn';

const checkboxVariants = cva(
  `w-5 h-5 shrink-0 relative items-center justify-center rounded border transition-colors outline-none focus-visible:ring-2`,
  {
    variants: {
      checked: {
        true: 'border-button-primary-fill bg-button-primary-fill',
        false: 'border-divider-gray bg-white',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

interface Props extends ComponentPropsWithRef<typeof CheckboxPrimitive.Root>, VariantProps<typeof checkboxVariants> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Checkbox = ({ checked, className, onCheckedChange }: Props) => {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(checkboxVariants({ checked }), className)}
    >
      <CheckboxPrimitive.Indicator>
        <CheckIcon
          className={cn(
            checked ? 'text-text-basic-inverse' : 'text-text-basic',
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};
