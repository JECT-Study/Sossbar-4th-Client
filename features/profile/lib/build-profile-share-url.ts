import { ROUTES } from '@/shared/constants/routes';

const getSiteOrigin = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return '';
};

export const buildProfileShareUrl = (userId: number): string => {
  const path = ROUTES.PROFILE(userId);
  const origin = getSiteOrigin();

  return origin ? `${origin}${path}` : path;
};
