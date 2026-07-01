import { BellFilledIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

type BellFilledProps = {
  unreadCount?: number;
  className?: string;
};

const formatBadgeLabel = (count: number): string => (count > 99 ? '99+' : String(count));

export const BellFilled = ({ unreadCount = 0, className }: BellFilledProps) => {
  const showBadge = unreadCount > 0;
  const badgeLabel = formatBadgeLabel(unreadCount);
  const isWideBadge = badgeLabel.length > 1;

  return (
    <span className={cn('relative inline-flex size-6 shrink-0 items-center justify-center', className)}>
      <BellFilledIcon aria-hidden className="text-icon-gray-light size-6" />
      {showBadge ? (
        <span
          className={cn(
            'bg-element-primary text-element-white absolute -top-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-medium',
            isWideBadge ? '-right-2' : '-right-1',
          )}
          aria-hidden
        >
          {badgeLabel}
        </span>
      ) : null}
    </span>
  );
};
