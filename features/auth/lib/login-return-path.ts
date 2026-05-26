const LOGIN_RETURN_KEY = 'sossbar:login-return';

const BLOCKED_PREFIXES = ['/login', '/signup'];

export const saveLoginReturnPath = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('modal');
  const query = url.searchParams.toString();
  const path = `${url.pathname}${query ? `?${query}` : ''}`;

  if (BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    sessionStorage.setItem(LOGIN_RETURN_KEY, '/');
    return;
  }

  sessionStorage.setItem(LOGIN_RETURN_KEY, path);
};

export const consumeLoginReturnPath = (): string => {
  if (typeof window === 'undefined') {
    return '/';
  }

  const raw = sessionStorage.getItem(LOGIN_RETURN_KEY);
  sessionStorage.removeItem(LOGIN_RETURN_KEY);

  if (
    !raw?.startsWith('/') ||
    raw.startsWith('//') ||
    raw.includes('://') ||
    BLOCKED_PREFIXES.some((prefix) => raw === prefix || raw.startsWith(`${prefix}/`) || raw.startsWith(`${prefix}?`))
  ) {
    return '/';
  }

  return raw;
};
