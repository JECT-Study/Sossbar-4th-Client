import { getSiteOrigin } from '@/shared/lib/get-site-origin';

export const buildProjectInviteUrl = (projectLink: string): string => {
  const token = projectLink.trim();
  const path = `/projects/invite/${token}`;
  const origin = getSiteOrigin();

  return origin ? `${origin}${path}` : path;
};
