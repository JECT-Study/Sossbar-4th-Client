import { useCallback } from 'react';

import { useCopyLinkFeedback } from '@/shared/hooks/use-copy-link-feedback';

import { buildProfileShareClipboardText } from '../lib/build-profile-share-clipboard-text';

type UseProfileShareParams = {
  userId: number;
};

export const useProfileShare = ({ userId }: UseProfileShareParams) => {
  const {
    open: isShareTooltipOpen,
    message: shareTooltipMessage,
    close: closeShareTooltip,
    copyLink,
  } = useCopyLinkFeedback();

  const shareProfile = useCallback(async () => {
    await copyLink(buildProfileShareClipboardText(userId));
  }, [copyLink, userId]);

  return {
    isShareTooltipOpen,
    shareTooltipMessage,
    closeShareTooltip,
    shareProfile,
  };
};
