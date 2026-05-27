'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { useKakaoCallback } from '@/features/auth/kakao/use-kakao-callback';

const KakaoCallbackContent = () => {
  const searchParams = useSearchParams();
  const { message } = useKakaoCallback(searchParams.get('code'), searchParams.get('error'));

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
