'use client';

import Image from 'next/image';
import { Dialog } from 'radix-ui';
import { useId } from 'react';

import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

export type DropcompleteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  className?: string;
};

type CompleteBodyProps = {
  headingId: string;
  descriptionId: string;
  onConfirm: () => void;
};

const CompleteBody = ({ headingId, descriptionId, onConfirm }: CompleteBodyProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative flex size-[120px] shrink-0 items-center justify-center p-[15px]" aria-hidden>
        <Image src="/check.svg" alt="" width={90} height={90} className="h-[90px] w-[90px] object-contain" />
      </div>

      <div className="flex w-full flex-col items-center gap-2 text-center">
        <Dialog.Title
          id={headingId}
          className="text-heading-base text-text-basic w-full text-center leading-normal font-bold tracking-normal"
        >
          회원 탈퇴 완료
        </Dialog.Title>
        <Dialog.Description
          id={descriptionId}
          className="text-body-base text-text-subtle w-full text-center leading-normal font-normal"
        >
          탈퇴 처리가 완료되었습니다.
        </Dialog.Description>
      </div>

      <Button type="button" variant="primary" size="medium" className="h-11 w-full shrink-0 px-5" onClick={onConfirm}>
        확인
      </Button>
    </div>
  );
};

export const Dropcomplete = ({ open, onOpenChange, onConfirm, className }: DropcompleteProps) => {
  const headingId = useId();
  const descriptionId = useId();

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          className={cn(
            'border-border-gray-light bg-surface-white fixed top-1/2 left-1/2 z-50 flex w-[min(360px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-hidden rounded-2xl border p-6 shadow-xl',
            className,
          )}
        >
          {open ? <CompleteBody headingId={headingId} descriptionId={descriptionId} onConfirm={handleConfirm} /> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
