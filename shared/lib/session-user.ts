'use client';

import { useSyncExternalStore } from 'react';

import { isServer } from '@/shared/constants/env';

const STORAGE_KEY = 'sossbar:user-session';

/**
 * `pnpm dev`에서는 기본적으로 sessionStorage 로 두어 새 탭·새 접속 시 로그인 전 상태를 기본값으로 맞춥니다.
 */
const getAuthStorage = (): Storage | null => {
  if (isServer) {
    return null;
  }
  return process.env.NODE_ENV === 'development' ? window.sessionStorage : window.localStorage;
};

export const SESSION_USER_EVENT = 'sossbar:user-session-change';

export type SessionUser = {
  userId: number;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
};

export const parseSessionUser = (raw: string | null): SessionUser | null => {
  if (!raw?.trim()) {
    return null;
  }
  try {
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object' || !('nickname' in data)) {
      return null;
    }
    const userId = 'userId' in data && typeof data.userId === 'number' ? data.userId : Number.NaN;
    if (!Number.isFinite(userId) || userId <= 0) {
      return null;
    }
    const nickname = typeof data.nickname === 'string' ? data.nickname.trim() : '';
    if (!nickname) {
      return null;
    }
    const email = 'email' in data && typeof data.email === 'string' ? data.email.trim() : '';
    const url =
      'profileImageUrl' in data && typeof data.profileImageUrl === 'string' && data.profileImageUrl.trim()
        ? data.profileImageUrl.trim()
        : null;
    return { userId, nickname, email, profileImageUrl: url };
  } catch {
    return null;
  }
};

export const getSessionUserFromStorage = (): SessionUser | null => {
  const storage = getAuthStorage();
  if (!storage) {
    return null;
  }
  return parseSessionUser(storage.getItem(STORAGE_KEY));
};

export const setSessionUser = (user: SessionUser) => {
  const storage = getAuthStorage();
  if (!storage) {
    return;
  }
  const payload: SessionUser = {
    userId: user.userId,
    nickname: user.nickname.trim(),
    email: user.email.trim(),
    profileImageUrl: user.profileImageUrl?.trim() || null,
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(SESSION_USER_EVENT));
};

export const clearSessionUser = () => {
  const storage = getAuthStorage();
  storage?.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_USER_EVENT));
};

const getServerSnapshot = () => '';

const getClientSnapshot = () => getAuthStorage()?.getItem(STORAGE_KEY) ?? '';

const subscribe = (onStoreChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  const onCustom = () => onStoreChange();
  window.addEventListener('storage', onStorage);
  window.addEventListener(SESSION_USER_EVENT, onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(SESSION_USER_EVENT, onCustom);
  };
};

export const useSessionUser = (): SessionUser | null => {
  const raw = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  return parseSessionUser(raw || null);
};
