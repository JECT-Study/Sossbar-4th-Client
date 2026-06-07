import type { ComponentProps, ReactElement, ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { DangerIcon, InfoIcon, SuccessIcon, TimeIcon, XIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

const guidanceBannerVariants = cva(
  'inline-flex w-full items-start gap-2 rounded-md px-4 py-2.5 text-body-base font-normal',
  {
    variants: {
      variant: {
        success:
          'bg-surface-success-subtler text-text-success shadow-[inset_0_0_0_1px_var(--color-border-success-light)]',
        warning:
          'bg-surface-warning-subtler text-text-warning shadow-[inset_0_0_0_1px_var(--color-border-warning-light)]',
        info: 'bg-surface-primary-subtler text-text-primary shadow-[inset_0_0_0_1px_var(--color-border-primary-light)]',
        error: 'bg-surface-error-subtler text-text-error shadow-[inset_0_0_0_1px_var(--color-border-error-light)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

type GuidanceBannerVariant = NonNullable<VariantProps<typeof guidanceBannerVariants>['variant']>;

const iconBaseClassName = 'mt-0.5 h-5 w-5 shrink-0';
const iconByVariant: Record<GuidanceBannerVariant, ReactElement> = {
  success: <SuccessIcon aria-hidden className={iconBaseClassName} />,
  warning: <TimeIcon aria-hidden className={iconBaseClassName} />,
  info: <InfoIcon aria-hidden className={iconBaseClassName} />,
  error: <DangerIcon aria-hidden className={iconBaseClassName} />,
};

type GuidanceBannerProps = ComponentProps<'div'> &
  VariantProps<typeof guidanceBannerVariants> & {
    onDismiss?: () => void;
    action?: ReactNode;
  };

export const GuidanceBanner = ({
  className,
  variant = 'info',
  children,
  onDismiss,
  action,
  ...restProps
}: GuidanceBannerProps) => (
  <div
    role={variant === 'error' ? 'alert' : 'status'}
    className={cn(guidanceBannerVariants({ variant }), className)}
    {...restProps}
  >
    {iconByVariant[variant ?? 'info']}
    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="leading-normal">{children}</span>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
    {onDismiss ? (
      <button
        type="button"
        className="text-text-subtle hover:text-text-basic mt-0.5 flex size-5 shrink-0 items-center justify-center"
        aria-label="안내 닫기"
        onClick={onDismiss}
      >
        <XIcon className="size-4" aria-hidden />
      </button>
    ) : null}
  </div>
);
