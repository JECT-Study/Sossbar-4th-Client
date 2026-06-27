/** query string에서 대상 key만 갱신한다. */
export const setSearchParam = (params: URLSearchParams, key: string, value: string): URLSearchParams => {
  const next = new URLSearchParams(params.toString());
  next.set(key, value);
  return next;
};

/** query string에서 대상 key만 제거한다. */
export const removeSearchParam = (params: URLSearchParams, key: string): URLSearchParams => {
  const next = new URLSearchParams(params.toString());
  next.delete(key);
  return next;
};

/** pathname과 query string을 URL로 합친다. */
export const buildPathWithSearch = (pathname: string, params: URLSearchParams): string => {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};
