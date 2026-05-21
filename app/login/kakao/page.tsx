'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { kakaoLogin, getMyProfile } from '@/features/auth/kakao/fetchers';
import { setAuthToken } from '@/shared/lib/auth-token';

const KakaoCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      router.replace('/');
      return;
    }

    const handleLogin = async () => {
      try {
        const { accessToken, userId } = await kakaoLogin(code);
        setAuthToken({ accessToken, userId });

        const profile = await getMyProfile();
        // username이 없으면 최초 가입 → 온보딩 페이지로 이동
        router.replace(profile.username ? '/' : '/signup');
      } catch {
        router.replace('/');
      }
    };

    void handleLogin();
  }, [code, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-body-base text-text-subtle">카카오 로그인 중...</p>
    </div>
  );
};

const KakaoCallbackPage = () => (
  <Suspense>
    <KakaoCallbackContent />
  </Suspense>
);

export default KakaoCallbackPage;
