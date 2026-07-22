'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { SuccessIcon, XIcon } from '@/shared/assets/icons';

export const REVIEW_SUBMITTED_QUERY_KEY = 'reviewSubmitted';

/** 후기 제출 완료 후 목적지에서 노출하는 하단 토스트 */
export const ReviewSubmittedToast = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldShow = searchParams.get(REVIEW_SUBMITTED_QUERY_KEY) === '1';
  const [open, setOpen] = useState(shouldShow);

  useEffect(() => {
    setOpen(shouldShow);
  }, [shouldShow]);

  const close = useCallback(() => {
    setOpen(false);
    if (!shouldShow) {
      return;
    }
    const next = new URLSearchParams(searchParams.toString());
    next.delete(REVIEW_SUBMITTED_QUERY_KEY);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams, shouldShow]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timerId = window.setTimeout(close, 4000);
    return () => window.clearTimeout(timerId);
  }, [close, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-5"
    >
      <div className="bg-surface-inverse pointer-events-auto flex w-full max-w-[350px] items-center gap-2 rounded-lg px-4 py-3 shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
        <SuccessIcon aria-hidden className="size-6 shrink-0" />
        <p className="text-body-sm text-text-basic-inverse min-w-0 flex-1 font-medium">후기 제출이 완료되었습니다.</p>
        <button
          type="button"
          className="text-text-basic-inverse flex size-5 shrink-0 items-center justify-center"
          aria-label="알림 닫기"
          onClick={close}
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
};
