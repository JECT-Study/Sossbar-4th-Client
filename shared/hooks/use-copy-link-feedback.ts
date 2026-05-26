'use client';

import { useCallback, useState } from 'react';

import { copyTextToClipboard } from '@/shared/lib/copy-text-to-clipboard';

const COPY_SUCCESS_MESSAGE = '링크가 복사되었습니다';
const COPY_FAILURE_MESSAGE = '링크 복사에 실패했습니다';

export const useCopyLinkFeedback = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(COPY_SUCCESS_MESSAGE);

  const close = useCallback(() => setOpen(false), []);

  const copyLink = useCallback(async (text: string) => {
    const copied = await copyTextToClipboard(text);
    setMessage(copied ? COPY_SUCCESS_MESSAGE : COPY_FAILURE_MESSAGE);
    setOpen(true);
  }, []);

  return { open, message, close, copyLink };
};
