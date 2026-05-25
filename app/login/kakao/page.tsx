'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { kakaoLogin } from '@/features/auth/kakao/fetchers';
import { completeLoginSession } from '@/features/auth/lib/complete-login';
import { consumeLoginReturnPath } from '@/features/auth/lib/login-return-path';
import { ROUTES } from '@/shared/constants/routes';

const KakaoCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
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

        if (needsOnboarding) {
          router.replace(ROUTES.SIGNUP);
          return;
        }

        router.replace(consumeLoginReturnPath());
      } catch {
        setMessage('로그인에 실패했습니다. 메인으로 이동합니다.');
        router.replace(ROUTES.HOME);
      }
    };

    void handleLogin();
  }, [code, error, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-body-base text-text-subtle">{message}</p>
    </div>
  );
};

const KakaoCallbackPage = () => (
  <Suspense>
    <KakaoCallbackContent />
  </Suspense>
);

export default KakaoCallbackPage;
