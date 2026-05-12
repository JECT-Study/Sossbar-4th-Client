import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface Props {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

export const FormField = ({ label, htmlFor, children, className }: Props) => (
  <div className={cn('flex flex-col gap-1', className)}>
    <label htmlFor={htmlFor} className="text-detail-base text-text-basic block font-bold">
      {label}
    </label>
    {children}
  </div>
);
