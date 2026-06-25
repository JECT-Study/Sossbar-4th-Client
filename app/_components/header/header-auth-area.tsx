import { Suspense } from 'react';

import { KakaoLoginButton } from '@/shared/components/button/kakao-login-button';

import { HeaderAuthAreaClient } from './header-auth-area-client';

export const HeaderAuthArea = () => {
  return (
    <Suspense fallback={<KakaoLoginButton />}>
      <HeaderAuthAreaClient />
    </Suspense>
  );
};
