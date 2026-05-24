'use client';

import { useLoginModal } from '@/shared/hooks/use-login-modal';

import { Button } from './button';

export const KakaoLoginButton = () => {
  const { openLoginModal } = useLoginModal();

  return (
    <Button type="button" className="self-center" onClick={openLoginModal}>
      로그인
    </Button>
  );
};
