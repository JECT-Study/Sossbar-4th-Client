import { DangerIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

interface Props {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const ErrorMessage = ({ id, className, children }: Props) => {
  return (
    <div role="alert" id={id} className={cn('flex items-start gap-1', className)}>
      <DangerIcon width={16} height={16} className="pointer-events-none mt-0.5 shrink-0" aria-hidden />
      <span className="text-body-sm text-text-error">{children}</span>
    </div>
  );
};
