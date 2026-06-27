'use client';

import Image from 'next/image';
import { Dialog } from 'radix-ui';

import { saveLoginReturnPath } from '@/features/auth/lib/login-return-path';
import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { KakaoTalkIcon, XIcon } from '@/shared/assets/icons';
import { useLoginModal } from '@/shared/hooks/use-login-modal';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const LoginModal = () => {
  const { data: profile } = useMyProfile();
  const { isOpen, onOpenChange } = useLoginModal({ isAuthenticated: profile !== null && profile !== undefined });

  const handleKakaoLogin = () => {
    saveLoginReturnPath();
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black-75 fixed inset-0 z-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-20 flex w-lg -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border bg-white p-10 text-center">
          <Dialog.Close className="ml-auto w-fit cursor-pointer">
            <XIcon width={24} height={24} />
          </Dialog.Close>
          <div className="flex w-full flex-col gap-6">
            <Image src="/login_image.svg" alt="로그인 이미지" width={100} height={100} className="mx-auto" />
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
              className="text-text-basic text-body-xl relative w-full cursor-pointer rounded-lg bg-[#FAE100] px-7 py-3.5 font-medium"
            >
              <div className="absolute top-1/2 left-7 flex h-6 w-6 -translate-y-1/2">
                <KakaoTalkIcon width={24} height={24} />
              </div>
              카카오로 3초만에 시작하기
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
