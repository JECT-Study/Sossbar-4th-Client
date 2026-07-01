import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const trackVariants = cva(
  'relative inline-flex h-6 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors focus-visible:ring-border-primary focus-visible:ring-2',
  {
    variants: {
      checked: {
        true: 'bg-button-primary-fill',
        false: 'bg-surface-gray-subtle',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
);

interface Props
  extends
    Omit<ComponentProps<'button'>, 'onChange' | 'type'>,
    Omit<VariantProps<typeof trackVariants>, 'checked' | 'disabled'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle = ({ checked, onCheckedChange, disabled = false, className, ...restProps }: Props) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(trackVariants({ checked, disabled }), className)}
      {...restProps}
    >
      <span
        aria-hidden
        className={cn(
          'bg-surface-white size-5 rounded-full shadow-sm transition-transform',
          checked ? 'translate-x-3' : 'translate-x-0',
        )}
      />
    </button>
  );
};
