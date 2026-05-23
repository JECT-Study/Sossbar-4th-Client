import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const countVariants = cva('text-body-sm ml-auto shrink-0 whitespace-nowrap tabular-nums', {
  variants: {
    state: {
      idle: 'text-text-disabled',
      focused: 'text-border-primary',
      filled: 'text-input-border',
      success: 'text-text-success',
      error: 'text-text-error',
      disabled: 'text-text-subtle',
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

interface Props extends VariantProps<typeof countVariants> {
  current: number;
  max: number;
  className?: string;
}

export const CharCount = ({ current, max, state, className }: Props) => (
  <span className={cn(countVariants({ state }), className)}>
    <span>{current}</span>
    <span className="text-text-subtle">/{max}</span>
  </span>
);
