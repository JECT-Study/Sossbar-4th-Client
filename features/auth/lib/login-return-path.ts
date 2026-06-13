const COOKIE_NAME = 'sossbar-login-return';

const BLOCKED_PREFIXES = ['/login', '/signup'];

export const saveLoginReturnPath = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // proxy에서 이미 복귀 경로를 설정한 경우 덮어쓰지 않음
  const hasCookie = document.cookie.split('; ').some((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (hasCookie) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('modal');
  const query = url.searchParams.toString();
  const path = `${url.pathname}${query ? `?${query}` : ''}`;

  const value = BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix)) ? '/' : path;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; SameSite=Lax; Max-Age=300`;
};
