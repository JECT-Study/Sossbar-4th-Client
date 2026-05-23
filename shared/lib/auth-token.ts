import { isServer } from '@/shared/constants/env';

const STORAGE_KEY = 'sossbar:auth-token';

export type AuthToken = {
  accessToken: string;
  userId: number;
};

export const getAuthToken = (): AuthToken | null => {
  if (isServer) {
    return null;
  }
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthToken;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: AuthToken): void => {
  if (isServer) {
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(token));
};

export const clearAuthToken = (): void => {
  if (isServer) {
    return;
  }
  window.sessionStorage.removeItem(STORAGE_KEY);
};
