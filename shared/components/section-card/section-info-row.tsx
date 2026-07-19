import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface Props {
  label: ReactNode;
  children: ReactNode;
  align?: 'center' | 'start';
  className?: string;
}

export const SectionInfoRow = ({ label, children, align = 'center', className }: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 lg:flex-row lg:gap-[60px]',
        align === 'center' ? 'lg:items-center' : 'items-start',
        className,
      )}
    >
      <span
        className={cn(
          'text-body-base text-text-subtle inline-flex items-center gap-1 font-bold lg:w-30 lg:shrink-0',
          align === 'start' && 'lg:pt-1.5',
        )}
      >
        {label}
      </span>
      <div className="max-w-[790px] min-w-0 flex-1">{children}</div>
    </div>
  );
};
