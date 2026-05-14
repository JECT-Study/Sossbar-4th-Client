'use client';

import { Dialog } from 'radix-ui';

import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

type ReviewSubmitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
};

export const ReviewSubmitDialog = ({ open, onOpenChange, onConfirm, isSubmitting }: ReviewSubmitDialogProps) => {
  const handleOpenChange = (next: boolean) => {
    if (!next && isSubmitting) {
      return;
    }
    onOpenChange(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black-75 fixed inset-0 z-50" />
        <Dialog.Content
          className={cn(
            'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex h-[216px] w-[360px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col',
            'gap-4 overflow-hidden rounded-xl border p-6 outline-none',
          )}
        >
          <div className="flex h-[108px] w-full shrink-0 flex-col gap-2 px-4 py-2">
            <Dialog.Title className="text-heading-base text-text-basic leading-normal font-bold">
              후기 제출
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="text-body-base text-text-subtle flex flex-col leading-normal">
                <p className="mb-0 leading-normal">후기를 제출 하시겠습니까?</p>
                <p className="leading-normal">제출 후 수정 및 삭제가 불가합니다.</p>
              </div>
            </Dialog.Description>
          </div>
          <div className="flex w-full shrink-0 justify-end gap-2">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="tertiary"
                size="medium"
                className="h-11 min-w-[68px] shrink-0 px-5"
                disabled={isSubmitting}
              >
                취소
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              variant="primary"
              size="medium"
              className="h-11 min-w-[68px] shrink-0 px-5"
              disabled={isSubmitting}
              onClick={() => {
                void onConfirm();
              }}
            >
              제출하기
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
