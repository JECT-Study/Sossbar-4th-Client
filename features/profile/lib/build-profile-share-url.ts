import { ROUTES } from '@/shared/constants/routes';
import { SHARE_USER_NAME_PARAM } from '@/shared/constants/share-query';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

export const buildProfileShareUrl = (userId: number, userName?: string): string => {
  const path = ROUTES.PROFILE(userId);
  const searchParams = new URLSearchParams();

  const trimmedName = userName?.trim();
  if (trimmedName) {
    searchParams.set(SHARE_USER_NAME_PARAM, trimmedName);
  }

  const query = searchParams.toString();
  const pathWithQuery = query ? `${path}?${query}` : path;
  const origin = getSiteOrigin();

  return origin ? `${origin}${pathWithQuery}` : pathWithQuery;
};
