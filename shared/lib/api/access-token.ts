import { isServer } from '@/shared/constants/env';

const ACCESS_TOKEN_KEY = 'sossbar:access-token';

const getTokenStorage = (): Storage | null => {
  if (isServer) {
    return null;
  }
  return process.env.NODE_ENV === 'development' ? window.sessionStorage : window.localStorage;
};

export const getAccessToken = (): string | null => {
  const storage = getTokenStorage();
  if (!storage) {
    return null;
  }
  const raw = storage.getItem(ACCESS_TOKEN_KEY)?.trim();
  return raw || null;
};

export const setAccessToken = (token: string) => {
  const storage = getTokenStorage();
  storage?.setItem(ACCESS_TOKEN_KEY, token.trim());
};

export const clearAccessToken = () => {
  const storage = getTokenStorage();
  storage?.removeItem(ACCESS_TOKEN_KEY);
};
