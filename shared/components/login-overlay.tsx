'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { KakaoTalkIcon, XIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

type LoginOverlayProps = {
  onDismiss: () => void;
};

export const LoginOverlay = ({ onDismiss }: LoginOverlayProps) => {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="로그인"
      onClick={onDismiss}
    >
      <div
        className="box-border flex h-[436px] w-[560px] shrink-0 flex-col rounded-2xl border border-[0.5px] border-(--color-divider-gray) bg-white p-[40px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-[8px] flex w-full shrink-0 justify-end">
          <Button
            type="button"
            variant="tertiary"
            onClick={onDismiss}
            aria-label="닫기"
            className={cn(
              'h-6 min-h-6 w-6 min-w-6 shrink-0 rounded-none border-0 bg-transparent p-0 shadow-none',
              'text-icon-gray [&_svg]:text-icon-gray hover:bg-transparent hover:opacity-80 focus-visible:ring-2 focus-visible:ring-(--color-border-primary)',
            )}
          >
            <XIcon width={24} height={24} aria-hidden />
          </Button>
        </div>

        <div className="flex w-full flex-col items-center gap-5">
          <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
            <Image src="/login_image.svg" alt="로그인 이미지" width={100} height={100} />
          </div>

          <h1 className="text-heading-lg text-text-basic font-bold tracking-tight">간편하게 로그인하세요</h1>

          <p className="text-heading-sm text-text-subtle text-center leading-normal font-medium">
            Sossbar의 모든 기능을 카카오 계정으로
            <br />
            바로 이용할 수 있습니다.
          </p>

          <button
            type="button"
            onClick={() => router.push('/signup')}
            className={cn(
              'relative flex h-14 w-full shrink-0 items-center rounded-xl px-6',
              'border-0 bg-[#FAE100] hover:bg-[#FAE100]',
              'transition-[filter] hover:brightness-95 active:brightness-90',
              'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-primary) focus-visible:ring-offset-2',
            )}
          >
            <span
              className="pointer-events-none absolute top-1/2 left-6 flex h-6 w-6 -translate-y-1/2 items-center justify-center"
              aria-hidden
            >
              <KakaoTalkIcon width={24} height={24} className="text-[#17191A]" />
            </span>
            <span className="text-detail-base text-text-basic pointer-events-none w-full text-center leading-normal font-medium">
              카카오로 3초만에 시작하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
