import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { buildPathWithSearch, removeSearchParam, setSearchParam } from '@/shared/lib/url/search-params';

/**
 * 현재 URL의 특정 query parameter를 읽고, 스크롤 위치를 유지한 채 갱신하거나 제거한다.
 */
export const useQueryParam = (key: string) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParamValue = searchParams.get(key);

  const updateQueryParam = useCallback(
    (value: string) =>
      router.push(buildPathWithSearch(pathname, setSearchParam(searchParams, key, value)), { scroll: false }),
    [key, pathname, router, searchParams],
  );

  const removeQueryParam = useCallback(
    () =>
      router.replace(buildPathWithSearch(pathname, removeSearchParam(searchParams, key)), {
        scroll: false,
      }),
    [key, pathname, router, searchParams],
  );

  return { queryParamValue, updateQueryParam, removeQueryParam };
};
