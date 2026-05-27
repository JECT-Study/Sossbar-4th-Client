import { ROUTES } from '@/shared/constants/routes';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

export const buildProfileShareUrl = (userId: number): string => {
  const path = ROUTES.PROFILE(userId);
  const origin = getSiteOrigin();

  return origin ? `${origin}${path}` : path;
};
