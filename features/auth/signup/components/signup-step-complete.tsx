'use client';

import Image from 'next/image';

import { Button } from '@/shared/components/button';

interface Props {
  onConfirm: () => void;
}

export const SignupStepComplete = ({ onConfirm }: Props) => {
  return (
    <div className="mt-10 flex w-full max-w-[460px] flex-col items-center">
      <Image src="/signup_image.svg" alt="" width={160} height={160} className="h-40 w-40" />

      <Button
        type="button"
        size="large"
        onClick={onConfirm}
        className="mt-10 w-full rounded-xl py-4 text-[18px] font-semibold"
      >
        프로필 공유하러 가기
      </Button>
    </div>
  );
};
