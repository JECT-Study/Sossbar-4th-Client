import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface Props {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({ title, action, children, className }: Props) => {
  return (
    <section
      className={cn('border-border-gray bg-surface-white flex justify-between rounded-2xl border p-8', className)}
    >
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-row items-center justify-between gap-4">
          <h2 className="text-heading-sm text-text-basic font-bold">{title}</h2>
          {action != null ? <div className="flex shrink-0 justify-end">{action}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
};
