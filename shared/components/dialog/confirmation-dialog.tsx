import type { ReactNode } from 'react';

import { Dialog } from 'radix-ui';

import { Button } from '../button/button';

interface Props {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
  open,
  title,
  description,
  confirmText,
  cancelText,
  onOpenChange,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black-75 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 flex w-[360px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-white p-6">
          <div className="flex flex-col gap-2 px-4 py-2">
            <Dialog.Title className="text-heading-base font-bold">{title}</Dialog.Title>
            <Dialog.Description className="text-body-base text-text-subtle">{description}</Dialog.Description>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="tertiary" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
