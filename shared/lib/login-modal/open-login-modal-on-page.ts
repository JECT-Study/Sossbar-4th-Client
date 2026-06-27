import { saveLoginReturnPath } from '@/features/auth/lib/login-return-path';
import { LOGIN_MODAL_QUERY_KEY, LOGIN_MODAL_QUERY_VALUE } from '@/shared/constants/login-modal-query';
import { buildPathWithSearch, setSearchParam } from '@/shared/lib/url/search-params';

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
