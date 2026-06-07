'use client';

import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog } from 'radix-ui';

import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export const AccountDeletionCompleteModal = ({ open, onOpenChange, onConfirm }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      onConfirm?.();
      queryClient.clear();
      router.push('/');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          className={cn(
            'border-border-gray-light bg-surface-white fixed top-1/2 left-1/2 z-50 flex w-[min(360px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-hidden rounded-2xl border p-6 shadow-xl',
          )}
        >
          <div className="flex w-full flex-col items-center gap-4">
            <div className="relative flex size-[120px] shrink-0 items-center justify-center p-[15px]" aria-hidden>
              <Image src="/check.svg" alt="" width={90} height={90} className="h-[90px] w-[90px] object-contain" />
            </div>

            <div className="flex w-full flex-col items-center gap-2 text-center">
              <Dialog.Title className="text-heading-base text-text-basic w-full text-center leading-normal font-bold tracking-normal">
                회원 탈퇴 완료
              </Dialog.Title>
              <Dialog.Description className="text-body-base text-text-subtle w-full text-center leading-normal font-normal">
                탈퇴 처리가 완료되었습니다.
              </Dialog.Description>
            </div>

            <Button
              type="button"
              variant="primary"
              size="medium"
              className="h-11 w-full shrink-0 px-5"
              onClick={() => handleOpenChange(false)}
            >
              확인
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
