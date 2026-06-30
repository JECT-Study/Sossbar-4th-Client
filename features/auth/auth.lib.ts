import { buildPathWithSearch, setSearchParam } from '@/shared/lib/url/search-params';

import { LOGIN_MODAL_QUERY_KEY, LOGIN_MODAL_QUERY_VALUE, LOGIN_RETURN_COOKIE_NAME } from './auth.constants';

const BLOCKED_PREFIXES = ['/login', '/signup'];

export const saveLoginReturnPath = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // proxy에서 이미 복귀 경로를 설정한 경우 덮어쓰지 않음
  const hasCookie = document.cookie.split('; ').some((row) => row.startsWith(`${LOGIN_RETURN_COOKIE_NAME}=`));
  if (hasCookie) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('modal');
  const query = url.searchParams.toString();
  const path = `${url.pathname}${query ? `?${query}` : ''}`;

  const value = BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix)) ? '/' : path;
  document.cookie = `${LOGIN_RETURN_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; SameSite=Lax; Max-Age=300`;
};

/**
 * 페이지 이동 없이 현재 URL에 `?modal=login`을 붙여 LoginModal을 연다.
 * useSearchParams를 쓰기 어려운 ProtectedLink 등에서 사용한다.
 */
export const openLoginModalOnPage = () => {
  saveLoginReturnPath();

  const currentParams = new URLSearchParams(window.location.search);
  const nextParams = setSearchParam(currentParams, LOGIN_MODAL_QUERY_KEY, LOGIN_MODAL_QUERY_VALUE);
  const nextUrl = buildPathWithSearch(window.location.pathname, nextParams);

  window.history.pushState(null, '', nextUrl);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

/**
 * 카카오 로그인 콜백 후 이동할 목적지를 결정한다.
 * needsOnboarding이면 항상 /signup, 아니면 returnPath 디코드 또는 /.
 */
export const resolveKakaoLoginDestination = ({
  needsOnboarding,
  returnPath,
}: {
  needsOnboarding: boolean;
  returnPath?: string;
}): string => {
  if (needsOnboarding) {
    return '/signup';
  }
  return returnPath ? decodeURIComponent(returnPath) : '/';
};
