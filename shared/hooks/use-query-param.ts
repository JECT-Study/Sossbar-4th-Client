import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/** query string에서 대상 key만 갱신한다. */
const setParam = (params: URLSearchParams, key: string, value: string): URLSearchParams => {
  const next = new URLSearchParams(params.toString());
  next.set(key, value);
  return next;
};

/** query string에서 대상 key만 제거한다. */
const removeParam = (params: URLSearchParams, key: string): URLSearchParams => {
  const next = new URLSearchParams(params.toString());
  next.delete(key);
  return next;
};

/** pathname과 query string을 URL로 합친다. */
const buildUrl = (pathname: string, params: URLSearchParams): string => {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

/**
 * 현재 URL의 특정 query parameter를 읽고, 스크롤 위치를 유지한 채 갱신하거나 제거한다.
 */
export const useQueryParam = (key: string) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParamValue = searchParams.get(key);

  const updateQueryParam = useCallback(
    (value: string) => router.push(buildUrl(pathname, setParam(searchParams, key, value)), { scroll: false }),
    [key, pathname, router, searchParams],
  );

  const removeQueryParam = useCallback(
    () =>
      router.replace(buildUrl(pathname, removeParam(searchParams, key)), {
        scroll: false,
      }),
    [key, pathname, router, searchParams],
  );

  return { queryParamValue, updateQueryParam, removeQueryParam };
};
