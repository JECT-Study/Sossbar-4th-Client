'use client';

import Image from 'next/image';
import { Dialog } from 'radix-ui';

type LoadingDialogProps = {
  open: boolean;
  /** @default '로딩 중...' */
  message?: string;
};

export const LoadingDialog = ({ open, message = '로딩 중...' }: LoadingDialogProps) => {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black-75 fixed inset-0 z-50" />
        <Dialog.Content
          className="border-border-gray fixed top-1/2 left-1/2 z-50 flex w-[328px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-xl border border-solid bg-white px-6 pt-6 pb-6"
          onPointerDownOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          aria-busy="true"
        >
          <div className="flex w-[112px] shrink-0 p-2">
            <Image
              src="/loading-animation.gif"
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
              unoptimized
              priority
            />
          </div>
          <div className="flex flex-col items-center px-4 py-2">
            <Dialog.Title className="text-heading-base text-text-basic w-[280px] text-center font-bold">
              {message}
            </Dialog.Title>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
