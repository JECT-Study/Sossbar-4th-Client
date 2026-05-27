'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ROUTES } from '@/shared/constants/routes';

import { kakaoLogin } from './fetchers';
import { completeLoginSession } from '../lib/complete-login';
import { consumeLoginReturnPath } from '../lib/login-return-path';

export const useKakaoCallback = (code: string | null, error: string | null) => {
  const router = useRouter();
  const didRun = useRef(false);
  const [message, setMessage] = useState('카카오 로그인 중...');

  useEffect(() => {
    if (didRun.current) {
      return;
    }
    didRun.current = true;

    if (error || !code) {
      router.replace(ROUTES.HOME);
      return;
    }

    const handleLogin = async () => {
      try {
        const login = await kakaoLogin(code);
        const { needsOnboarding } = await completeLoginSession(login);
        router.replace(needsOnboarding ? ROUTES.SIGNUP : consumeLoginReturnPath());
      } catch {
        setMessage('로그인에 실패했습니다. 메인으로 이동합니다.');
        router.replace(ROUTES.HOME);
      }
    };

    handleLogin();
  }, [code, error, router]);

  return { message };
};
