'use client';

import type { ReactNode } from 'react';

import { Dialog } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

import { DialogAnimatedPortal } from './dialog-animated-portal';
import { Button } from '../button/button';

type ConfirmationDialogProps = {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmText: string;
  cancelText: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isConfirming?: boolean;
  errorMessage?: string;
};

export const ConfirmationDialog = ({
  open,
  title,
  description,
  confirmText,
  cancelText,
  onOpenChange,
  onConfirm,
  isConfirming = false,
  errorMessage,
}: ConfirmationDialogProps) => {
  const handleOpenChange = (next: boolean) => {
    if (!next && isConfirming) {
      return;
    }
    onOpenChange(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <DialogAnimatedPortal
        open={open}
        className={cn(
          'border-border-gray bg-surface-white fixed top-1/2 left-1/2 z-50 flex w-full max-w-[min(28rem,calc(100vw-40px))] flex-col',
          'gap-4 overflow-hidden rounded-xl border p-6 outline-none',
        )}
      >
        <div className="flex min-h-[108px] w-full shrink-0 flex-col justify-center gap-2 px-4 py-2">
          <Dialog.Title className="text-heading-base text-text-basic leading-normal font-bold">{title}</Dialog.Title>
          <Dialog.Description asChild>
            <div className="text-body-base text-text-subtle flex flex-col leading-normal">{description}</div>
          </Dialog.Description>
        </div>
        {!!errorMessage && (
          <p className="text-body-sm text-text-error px-4" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="flex w-full shrink-0 justify-end gap-2">
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="tertiary"
              size="medium"
              className="h-11 min-w-[68px] shrink-0 px-5"
              disabled={isConfirming}
            >
              {cancelText}
            </Button>
          </Dialog.Close>
          <Button
            type="button"
            variant="primary"
            size="medium"
            className="h-11 min-w-[68px] shrink-0 px-5"
            disabled={isConfirming}
            onClick={() => {
              void onConfirm();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </DialogAnimatedPortal>
    </Dialog.Root>
  );
};
