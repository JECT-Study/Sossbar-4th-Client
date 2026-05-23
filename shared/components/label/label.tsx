import type { ComponentProps } from 'react';

import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

interface Props extends ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
}

export const Label = ({ className, children, required, ...restProps }: Props) => {
  return (
    <LabelPrimitive.Root
      className={cn('text-text-subtle text-heading-xs flex items-center gap-1 font-bold', className)}
      {...restProps}
    >
      {children}
      {required ? (
        <>
          <span className="text-text-tertiary text-heading-xs font-bold" aria-hidden="true">
            *
          </span>
          <span className="sr-only">필수</span>
        </>
      ) : null}
    </LabelPrimitive.Root>
  );
};
