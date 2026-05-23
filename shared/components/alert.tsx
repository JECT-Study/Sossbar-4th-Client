import type { ComponentProps, ReactElement } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { SuccessIcon, TimeIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

const alertVariants = cva(
  'inline-flex h-10 w-[720px] items-center gap-2 rounded-md box-border px-4 text-body-base font-normal',
  {
    variants: {
      variant: {
        warning:
          'bg-surface-warning-subtler text-text-warning shadow-[inset_0_0_0_1px_var(--color-border-warning-light)]',
        success:
          'bg-surface-success-subtler text-text-success shadow-[inset_0_0_0_1px_var(--color-border-success-light)]',
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  },
);

const defaultMessageByVariant = {
  warning: '방장의 확정을 기다리고 있습니다',
  success: '팀이 확정되었습니다! 후기 작성을 완료해볼까요?',
} as const;

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
const iconBaseClassName = 'h-6 w-6 shrink-0';

const iconByVariant: Record<AlertVariant, ReactElement> = {
  warning: <TimeIcon aria-hidden className={cn(iconBaseClassName, '[&_path]:fill-icon-warning')} />,
  success: <SuccessIcon aria-hidden className={iconBaseClassName} />,
};

interface AlertProps extends ComponentProps<'div'>, VariantProps<typeof alertVariants> {
  message?: string;
}

export const Alert = ({ className, variant = 'warning', message, children, ...restProps }: AlertProps) => {
  const resolvedVariant: AlertVariant = variant ?? 'warning';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      {...restProps}
    >
      {iconByVariant[resolvedVariant]}
      <span>{children ?? message ?? defaultMessageByVariant[resolvedVariant]}</span>
    </div>
  );
};
