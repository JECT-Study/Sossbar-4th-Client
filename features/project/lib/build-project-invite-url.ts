import { SHARE_INVITER_NAME_PARAM } from '@/shared/constants/share-query';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

import { PROJECT_INVITE_QUERY_KEY } from './project-invite-query';

export const buildProjectInviteUrl = (projectId: number, inviterName?: string): string => {
  const searchParams = new URLSearchParams({
    [PROJECT_INVITE_QUERY_KEY]: String(projectId),
  });

  const trimmedName = inviterName?.trim();
  if (trimmedName) {
    searchParams.set(SHARE_INVITER_NAME_PARAM, trimmedName);
  }

  const path = `/projects?${searchParams.toString()}`;
  const origin = getSiteOrigin();

  return origin ? `${origin}${path}` : path;
};
