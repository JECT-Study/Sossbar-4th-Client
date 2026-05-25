const isMswEnabledInDev = (): boolean =>
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW !== 'false';

/**
 * Trailing slash stripped. Empty string = same-origin `/api/v1` (MSW 또는 Next rewrite).
 * 개발 + MSW ON일 때는 `NEXT_PUBLIC_API_ORIGIN`을 무시해 cross-origin/CORS를 피합니다.
 */
export const getApiOrigin = (): string => {
  if (isMswEnabledInDev()) {
    return '';
  }
  return process.env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/$/, '') ?? '';
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
