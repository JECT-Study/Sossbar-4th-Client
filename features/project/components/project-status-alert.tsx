import type { ComponentProps, ReactElement } from 'react';

import { cva } from 'class-variance-authority';

import { SuccessIcon, TimeIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

import type { VariantProps } from 'class-variance-authority';

const projectStatusAlertVariants = cva(
  'inline-flex h-10 w-full items-center gap-2 rounded-md box-border px-4 text-body-base font-normal',
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

type ProjectStatusAlertVariant = NonNullable<VariantProps<typeof projectStatusAlertVariants>['variant']>;

const iconBaseClassName = 'h-6 w-6 shrink-0';
const iconByVariant: Record<ProjectStatusAlertVariant, ReactElement> = {
  warning: <TimeIcon aria-hidden className={iconBaseClassName} />,
  success: <SuccessIcon aria-hidden className={iconBaseClassName} />,
};

type ProjectStatusAlertProps = ComponentProps<'div'> & { variant?: ProjectStatusAlertVariant };

export const ProjectStatusAlert = ({
  className,
  variant = 'warning',
  children,
  ...restProps
}: ProjectStatusAlertProps) => (
  <div role="status" className={cn(projectStatusAlertVariants({ variant }), className)} {...restProps}>
    {iconByVariant[variant]}
    <span>{children ?? defaultMessageByVariant[variant]}</span>
  </div>
);
