const COOKIE_NAME = 'sossbar-login-return';

const BLOCKED_PREFIXES = ['/login', '/signup'];

export const saveLoginReturnPath = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('modal');
  const query = url.searchParams.toString();
  const path = `${url.pathname}${query ? `?${query}` : ''}`;

  const value = BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix)) ? '/' : path;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; SameSite=Lax; Max-Age=300`;
};
