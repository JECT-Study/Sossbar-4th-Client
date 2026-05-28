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

/** 초대 링크 — BE join API(`projectId`)와 맞춘 쿼리 URL */
export const buildProjectInviteUrl = (projectId: number): string => {
  const path = `/projects/invite?projectId=${projectId}`;
  const origin = getSiteOrigin();

  return origin ? `${origin}${path}` : path;
};
