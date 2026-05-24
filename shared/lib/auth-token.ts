import { isServer } from '@/shared/constants/env';

const STORAGE_KEY = 'sossbar:auth-token';

export type AuthToken = {
  accessToken: string;
  userId: number;
};

const getStorage = (): Storage | null => {
  if (isServer) {
    return null;
  }
  return process.env.NODE_ENV === 'development' ? window.sessionStorage : window.localStorage;
};

export const getAuthToken = (): AuthToken | null => {
  const raw = getStorage()?.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const data = JSON.parse(raw) as unknown;
    if (
      !data ||
      typeof data !== 'object' ||
      !('accessToken' in data) ||
      !('userId' in data) ||
      typeof (data as { accessToken: unknown }).accessToken !== 'string' ||
      typeof (data as { userId: unknown }).userId !== 'number'
    ) {
      return null;
    }
    return data as AuthToken;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: AuthToken) => {
  getStorage()?.setItem(STORAGE_KEY, JSON.stringify(token));
};

export const clearAuthToken = () => {
  getStorage()?.removeItem(STORAGE_KEY);
};
