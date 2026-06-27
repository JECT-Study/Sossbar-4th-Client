'use client';

import { useLoginModal } from '@/shared/hooks/use-login-modal';

import { Button } from './button';

export const KakaoLoginButton = () => {
  const { openLoginModal } = useLoginModal();

  return (
    <Button
      type="button"
      size="medium"
      className="h-10 w-[90px] min-w-[68px] shrink-0 rounded-md px-5 py-0"
      onClick={openLoginModal}
    >
      로그인
    </Button>
  );
};
