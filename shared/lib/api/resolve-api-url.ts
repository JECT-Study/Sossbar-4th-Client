/** Trailing slash stripped. Empty string = same-origin `/api/v1` (local MSW or Next rewrites). */
export const getApiOrigin = (): string => process.env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/$/, '') ?? '';

export const buildApiUrl = (basePath: string, path: string): string => {
  const origin = getApiOrigin();
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (origin) {
    return `${origin}${normalizedBase}${normalizedPath}`;
  }

  return `${normalizedBase}${normalizedPath}`;
};
