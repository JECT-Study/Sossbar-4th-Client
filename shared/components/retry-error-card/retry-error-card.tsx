import { PressableButton } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  className?: string;
  actionClassName?: string;
  onRetry: () => void;
}

export const RetryErrorCard = ({
  title,
  description,
  actionLabel = '다시 시도',
  className,
  actionClassName,
  onRetry,
}: Props) => {
  return (
    <section
      className={cn(
        'border-border-gray-light bg-surface-gray-subtler flex w-full flex-col items-center justify-center gap-6 rounded-lg border py-8',
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-heading-sm text-text-basic font-bold">{title}</h2>
        <p className="text-body-base text-text-subtle">{description}</p>
      </div>

      <PressableButton size="medium" onClick={onRetry} className={cn('mx-auto', actionClassName)}>
        {actionLabel}
      </PressableButton>
    </section>
  );
};
