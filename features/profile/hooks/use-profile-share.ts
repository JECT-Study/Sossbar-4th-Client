import { useCallback } from 'react';

import { useCopyLinkFeedback } from '@/shared/hooks/use-copy-link-feedback';

import { buildProfileShareClipboardText } from '../lib/build-profile-share-clipboard-text';

interface Params {
  userId: number;
  userName?: string;
}

export const useProfileShare = ({ userId, userName }: Params) => {
  const {
    open: isShareTooltipOpen,
    message: shareTooltipMessage,
    close: closeShareTooltip,
    copyLink,
  } = useCopyLinkFeedback();

  const shareProfile = useCallback(async () => {
    await copyLink(buildProfileShareClipboardText(userId, userName));
  }, [copyLink, userId, userName]);

  return {
    isShareTooltipOpen,
    shareTooltipMessage,
    closeShareTooltip,
    shareProfile,
  };
};
