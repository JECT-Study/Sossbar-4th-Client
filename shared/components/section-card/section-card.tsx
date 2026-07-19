import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface Props {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export const SectionCard = ({ title, action, children, className, headerClassName }: Props) => {
  return (
    <section
      className={cn(
        'border-border-gray bg-surface-white flex justify-between rounded-xl border p-5 lg:rounded-2xl lg:p-8',
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-6 lg:gap-8">
        <div className={cn('flex flex-row items-center justify-between gap-4', headerClassName)}>
          <h2 className="text-heading-sm text-text-basic min-w-0 font-bold">{title}</h2>
          {action != null ? <div className="flex shrink-0 justify-end">{action}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
};
