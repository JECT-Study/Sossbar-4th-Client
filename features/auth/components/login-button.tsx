'use client';

import { Button } from '@/shared/components/button';

import { useLoginGate } from '../login-modal.hooks';

export const LoginButton = () => {
  const { openLogin } = useLoginGate();

  return (
    <Button
      type="button"
      size="medium"
      className="h-10 w-[90px] min-w-[68px] shrink-0 rounded-md px-5 py-0"
      onClick={openLogin}
    >
      로그인
    </Button>
  );
};
