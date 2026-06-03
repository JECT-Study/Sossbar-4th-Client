import { isServer } from '@/shared/constants/env';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

const isMswEnabledInDev = (): boolean =>
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW !== 'false';

const stripTrailingSlash = (value: string): string => value.replace(/\/$/, '');

/**
 * Trailing slash stripped. Empty string = same-origin `/api/v1` (MSW 또는 Next rewrite).
 * 개발 + MSW ON일 때는 `NEXT_PUBLIC_API_ORIGIN`을 무시해 cross-origin/CORS를 피합니다.
 *
 * Node.js fetch(RSC prefetch 등)는 상대 URL을 파싱할 수 없어 서버에서는 절대 URL origin을 반환합니다.
 */
export const getApiOrigin = (): string => {
  if (isMswEnabledInDev()) {
    return '';
  }

  const envOrigin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim();
  if (envOrigin) {
    return stripTrailingSlash(envOrigin);
  }

  if (!isServer) {
    return '';
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (apiBase) {
    return stripTrailingSlash(apiBase);
  }

  const siteOrigin = getSiteOrigin();
  if (siteOrigin) {
    return siteOrigin;
  }

  return 'http://localhost:3000';
};

export const buildApiUrl = (basePath: string, path: string): string => {
  const origin = getApiOrigin();
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (origin) {
    return `${origin}${normalizedBase}${normalizedPath}`;
  }

  return `${normalizedBase}${normalizedPath}`;
};
