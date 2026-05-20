import type { ComponentProps, ReactElement } from 'react';

import { cn } from '@/shared/lib/cn';

interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  'aria-label': string;
  disabled?: boolean;
  icon: ReactElement;
}

export const IconButton = ({ className, disabled, icon, ...restProps }: IconButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex h-8 w-9 items-center justify-center rounded-sm transition-colors [&>svg]:size-4 [&>svg]:shrink-0',
        disabled
          ? 'bg-button-disabled-fill text-icon-disabled cursor-not-allowed'
          : 'hover:bg-button-tertiary-fill-hover active:bg-button-tertiary-fill-pressed bg-button-tertiary-fill text-icon-gray-light cursor-pointer',
        className,
      )}
      disabled={disabled}
      {...restProps}
    >
      {icon}
    </button>
  );
};
