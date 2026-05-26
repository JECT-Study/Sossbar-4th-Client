'use client';

import { useEffect } from 'react';

import { XIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

const AUTO_DISMISS_MS = 3000;

type CopyFeedbackTooltipProps = {
  open: boolean;
  onClose: () => void;
  message?: string;
  className?: string;
};

export const CopyFeedbackTooltip = ({
  open,
  onClose,
  message = '링크가 복사되었습니다',
  className,
}: CopyFeedbackTooltipProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timerId = window.setTimeout(onClose, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timerId);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 flex -translate-x-1/2 flex-col items-center',
        className,
      )}
    >
      <div className="bg-surface-inverse flex max-w-[360px] items-center gap-2 rounded px-3 py-1">
        <p className="text-body-sm text-text-basic-inverse font-normal whitespace-nowrap">{message}</p>
        <button
          type="button"
          className="text-text-basic-inverse pointer-events-auto flex size-4 shrink-0 items-center justify-center"
          aria-label="알림 닫기"
          onClick={onClose}
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      </div>
      <span className="border-t-surface-inverse size-0 border-x-8 border-t-8 border-x-transparent" aria-hidden />
    </div>
  );
};
