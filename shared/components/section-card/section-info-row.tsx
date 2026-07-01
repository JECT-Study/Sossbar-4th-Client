import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface Props {
  label: string;
  children: ReactNode;
  align?: 'center' | 'start';
  className?: string;
}

export const SectionInfoRow = ({ label, children, align = 'center', className }: Props) => {
  return (
    <div className={cn('flex gap-[60px]', align === 'center' ? 'items-center' : 'items-start', className)}>
      <span className={cn('text-body-base text-text-subtle w-30 shrink-0 font-bold', align === 'start' && 'pt-1.5')}>
        {label}
      </span>
      <div className="max-w-[790px] min-w-0 flex-1">{children}</div>
    </div>
  );
};
