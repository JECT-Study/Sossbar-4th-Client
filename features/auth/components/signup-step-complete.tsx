'use client';

import Image from 'next/image';

import { Button } from '@/shared/components/button';

interface Props {
  onConfirm: () => void;
}

export const SignupStepComplete = ({ onConfirm }: Props) => {
  return (
    <div className="mt-10 flex w-full max-w-[480px] flex-col items-center">
      <Image src="/signup_image.svg" alt="" width={260} height={260} className="size-[260px] lg:size-40" priority />

      <Button
        type="button"
        size="medium"
        onClick={onConfirm}
        className="text-body-xl lg:text-body-base mt-[140px] h-14 w-full lg:mt-12 lg:h-auto"
      >
        프로젝트 생성하러 가기
      </Button>
    </div>
  );
};
