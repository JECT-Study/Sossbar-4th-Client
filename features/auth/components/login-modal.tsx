'use client';

import Image from 'next/image';
import { Dialog } from 'radix-ui';

import { useMyProfile } from '@/features/profile';
import { KakaoTalkIcon, XIcon } from '@/shared/assets/icons';
import { DialogAnimatedPortal } from '@/shared/components/dialog';

import { saveLoginReturnPath } from '../auth.lib';
import { useLoginGate } from '../login-modal.hooks';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const LoginModal = () => {
  const { data: profile } = useMyProfile();
  const { isOpen, onOpenChange } = useLoginGate({ isAuthenticated: profile != null });

  const handleKakaoLogin = () => {
    saveLoginReturnPath();
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogAnimatedPortal
        open={isOpen}
        overlayClassName="z-30"
        className="fixed top-1/2 left-1/2 z-30 flex w-[calc(100vw-40px)] max-w-lg flex-col items-center gap-4 rounded-2xl border bg-white p-6 text-center sm:p-10"
      >
        <Dialog.Close className="ml-auto flex size-11 cursor-pointer items-center justify-center">
          <XIcon width={14} height={14} />
        </Dialog.Close>
        <div className="flex w-full flex-col gap-6">
          <Image
            src="/login_image.svg"
            alt="로그인 이미지"
            width={100}
            height={100}
            className="mx-auto size-20 sm:size-[100px]"
          />
          <div className="flex flex-col gap-2">
            <Dialog.Title className="text-heading-base font-bold">간편하게 로그인하세요</Dialog.Title>
            <Dialog.Description className="text-body-base text-text-subtle">
              Sossbar의 모든 기능을 카카오 계정으로
              <br />
              바로 이용할 수 있습니다.
            </Dialog.Description>
          </div>
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="text-text-basic text-body-base sm:text-body-xl relative flex h-14 w-full cursor-pointer items-center justify-center rounded-lg bg-[#FAE100] px-7 font-medium"
          >
            <span className="absolute top-1/2 left-7 flex size-6 -translate-y-1/2">
              <KakaoTalkIcon width={24} height={24} />
            </span>
            카카오로 3초만에 시작하기
          </button>
        </div>
      </DialogAnimatedPortal>
    </Dialog.Root>
  );
};
