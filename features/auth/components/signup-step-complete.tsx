'use client';

import Image from 'next/image';

import { Button } from '@/shared/components/button';

interface Props {
  onConfirm: () => void;
}

export const SignupStepComplete = ({ onConfirm }: Props) => {
  return (
    <div className="mt-10 flex w-full max-w-[480px] flex-col items-center">
      <Image src="/signup_image.svg" alt="" width={160} height={160} className="h-40 w-40" />

      <Button type="button" size="medium" onClick={onConfirm} className="mt-12 w-full">
        프로필 공유하러 가기
      </Button>
    </div>
  );
};
